import express from "express";
import request from "request";
import moment from "moment";
import Bill from "../model/bill.js";
import Cart from "../model/cart.js";
import qs from "qs";
import crypto from "crypto";
import Coupon from "../model/coupon.js";
import User from "../model/user.js";
import Payment_status from "../model/payment_status.js";
import Payment_method from "../model/paymentMethod.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

import { PayPal, PayPalSuccess } from "../controller/payment/paypal.js";

const Router = express.Router();
Router.post("/create_pay", PayPal);
Router.get("/success", PayPalSuccess);

Router.post("/create_payment_url", async function (req, res, next) {
  const {
    user_id,
    bill_shippingAddress,
    bill_note,
    coupon_id,
    products,
    bill_phone,
    bill_fullName,
    bill_totalOrder,
    bill_shippingFee,
    payment_status,
    bill_totalPrice,
    status,
    payment_method = "vnpay",
  } = req.body;

  const user = await User.findOne({ _id: user_id });
  if (!user) {
    return res.status(400).json({ message: "Tài khoản không tồn tại!" });
  }
  const carts = await Cart.findOne({ user_id });
  if (!carts) {
    return res.status(400).json({
      message: "Thông tin cart không tồn tại",
    });
  }

  const existPayment_method = await Payment_method.findOne({
    _id: payment_method,
  });
  if (!existPayment_method) {
    return res
      .status(400)
      .json({ message: "Phương thức thanh toán không tồn tại!" });
  }

  if (coupon_id !== null) {
    const coupon = await Coupon.findById(coupon_id);
    if (coupon) {
      if (coupon.coupon_quantity > 0) {
        coupon.coupon_quantity -= 1;
        await coupon.save();
      } else {
        return res
          .status(400)
          .json({ message: "Phiếu giảm giá đã hết lượt sử dụng" });
      }
    }
  }

  let deliveryStatus = await Payment_status.findOne({
    pStatus_name: "Pending",
  });

  if (!deliveryStatus) {
    deliveryStatus = await Payment_status.create({ pStatus_name: "Pending" });
  }

  const bill_code = crypto.randomBytes(3).toString("hex").toUpperCase();

  const data = await Bill.create({
    bill_code: bill_code,
    user_id: user_id,
    bill_fullName: bill_fullName ? bill_fullName : user.user_fullname,
    user_username: user.user_username,
    user_email: user.user_email,
    user_avatar: user.user_avatar,
    bill_phone: bill_phone ? bill_phone : user.user_phone,
    bill_shippingAddress: bill_shippingAddress
      ? bill_shippingAddress
      : user.address,
    bill_totalPrice: bill_totalPrice,
    bill_totalOrder: bill_totalOrder,
    bill_shippingFee: bill_shippingFee,
    payment_method: existPayment_method._id,
    payment_status: deliveryStatus._id,
    bill_note: bill_note,
    products: products,
  });
  process.env.TZ = "Asia/Ho_Chi_Minh";

  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");

  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let tmnCode = "18WH6AY8";
  let secretKey = "BCOLWYSKNIWURZRHHJKMQXVRMDYCGDCA";
  let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  let returnUrl =
    "http://localhost:8080/api/vnpay_return" + `?userId=${req.body.user_id}`;
  const amount = +data?.bill_totalPrice;
  const orderId = data._id.toHexString();

  let locale = req.body.language || "vn";
  if (locale === null || locale === "") {
    locale = "vn";
  }
  let currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  vnp_Params["vnp_BankCode"] = "VNPAY";

  vnp_Params = sortObject(vnp_Params);
  let signData = qs.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + qs.stringify(vnp_Params, { encode: false });

  res.json(vnpUrl);
});

Router.get("/vnpay_return", async function (req, res, next) {
  let { userId, ...vnp_Params } = req.query;
  const bill = vnp_Params["vnp_TxnRef"];

  let secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  let secretKey = "BCOLWYSKNIWURZRHHJKMQXVRMDYCGDCA";
  let rspCode = vnp_Params["vnp_ResponseCode"];

  let signData = qs.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  if (secureHash === signed) {
    if (rspCode == "00") {
      await Bill.findOneAndUpdate({ _id: bill }, { $set: { status: "Paid" } });

      const user = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(400).json({ message: "Tài khoản không tồn tại!" });
      }

      const transporter = nodemailer.createTransport({
        host: "smtp.forwardemail.net",
        port: 465,
        secure: true,
        service: "gmail",
        auth: {
          user: process.env.EMAIL_SENDER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const info = await transporter.sendMail({
        from: `"6s Shoes 👟😘" ${process.env.EMAIL_SENDER}`,
        to: user.user_email,
        subject: "Cảm ơn bạn đã mua hàng bên shop 6s Shoes 👟",
        html: `<p style="font-size: 16px; color: #002140; font-weight: 600;">Mong khách hàng chú ý đơn hàng để có thể giao đúng hẹn</p>`,
      });

      if (!info) {
        return res.status(400).json({
          message: "Đơn hàng chưa được thông báo về email",
        });
      }

      res.redirect(`http://localhost:5173/account/bills`);
    } else {
      res.redirect(`http://localhost:5173/checkouts`);
    }
  } else {
    res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
  }
});

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

export default Router;
