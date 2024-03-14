import User from "../../model/user.js";
import Cart from "../../model/cart.js";
import Coupon from "../../model/coupon.js";
import Payment_status from "../../model/payment_status.js";
import Payment_method from "../../model/paymentMethod.js";
import VariantProduct from "../../model/variant_product.js";
import Bill from "../../model/bill.js";
import { CreateBillSchema } from "../../schema/bill.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const createBill = async (req, res) => {
  const {
    user_id,
    bill_shippingAddress,
    bill_note,
    coupon_id,
    products,
    bill_phone,
    bill_fullName,
    payment_method,
    bill_totalPrice,
    bill_totalOrder,
    bill_shippingFee,
  } = req.body;

  const formData = req.body;
  try {
    const { error } = CreateBillSchema.validate(formData, {
      abortEarly: false,
    });

    if (error) {
      const errorFormReq = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errorFormReq,
      });
    }

    const user = await User.findOne({ _id: user_id });

    if (!user) {
      return res.status(400).json({ message: "Tài khoản không tồn tại!" });
    }

    const cart = await Cart.findOne({ _id: user.cart_id });
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng không tồn tại!" });
    }

    if (!payment_method) {
      return res
        .status(400)
        .json({ message: "Phương thức thanh toán là bắt buộc!" });
    }

    const existPayment_method = await Payment_method.findOne({
      _id: payment_method,
    });

    if (!existPayment_method) {
      return res
        .status(400)
        .json({ message: "Phương thức thanh toán không tồn tại!" });
    }

    if (coupon_id) {
      const coupon = await Coupon.findById({ _id: coupon_id });
      if (
        coupon.coupon_quantity <= 0 ||
        (coupon.expiration_date &&
          new Date(coupon.expiration_date) < new Date())
      ) {
        return res.status(400).json({
          message: "Phiếu giảm giá đã hết lượt sử dụng hoặc đã hết hạn",
        });
      }

      if (coupon.isSpecial === true) {
        if (!coupon.users.includes(user_id)) {
          return res
            .status(400)
            .json({ message: "Mã giảm giá không áp dụng được cho bạn." });
        }
      }

      if (bill_totalPrice <= coupon.min_purchase_amount) {
        return res
          .status(400)
          .json({ message: "Không đủ điều kiện áp dụng mã giảm giá." });
      }

      if (Number(bill_totalPrice) < Number(coupon.discount_amount)) {
        return res.status(400).json({
          message: "Số tiền không đủ điều kiện để sử dụng mã giảm giá",
        });
      }
    }

    for (const item of products) {
      const product = await VariantProduct.findById(item.variant_product_id);
      if (product) {
        product.variant_quantity -= item.quantity;
        await product.save();
      }
    }

    let deliveryStatus = await Payment_status.findOne({
      pStatus_name: "Pending",
    });

    if (!deliveryStatus) {
      deliveryStatus = await Payment_status.create({ pStatus_name: "Pending" });
    }

    const bill_code = crypto.randomBytes(3).toString("hex").toUpperCase();
    const newBill = await Bill.create({
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
      pStatus_name: deliveryStatus.pStatus_name,
      bill_note: bill_note,
      products: products,
      coupon_id: coupon_id || undefined,
    });

    await Coupon.updateOne(
      { _id: coupon_id },
      { $addToSet: { used_by_users: user_id }, $inc: { coupon_quantity: -1 } }
    );

    // Tìm kiếm với điều kiện user_id và pStatus_name
    const result = await Bill.find({
      user_id,
      pStatus_name: "Delivered",
    });

    const totalPriceSum = result.reduce(
      (sum, item) => sum + item.bill_totalOrder,
      0
    );

    if (totalPriceSum >= 2000000) {
      const CouponKHTT = await Coupon.findOneAndUpdate(
        {
          coupon_code: "KHTT100K",
        },
        { $addToSet: { used_by_users: user_id } }
      );
      if (CouponKHTT && !CouponKHTT.used_by_users.includes(user_id)) {
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
        await transporter.sendMail({
          from: `"6s Shoes 👟😘" ${process.env.EMAIL_SENDER}`,
          to: user.user_email,
          subject:
            "Cảm ơn bạn đã nhận mã giảm giá bên shop 6s Shoes 👟 sau khi đạt tổng hóa đơn trên 2 triệu!",
          html: `<p style="font-size: 16px; color: #002140; font-weight: 600;">Cảm ơn quý khách đã tin tưởng ủng hộ shop 6s Shoes 👟</p>`,
        });
      }
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

    return res.status(200).json({
      message: "Đơn hàng đã được tạo thành công!",
      bill: newBill,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// if (!CouponKHTT) {
//   CouponKHTT = await Coupon.create({
//     coupon_code: "KHTT100K",
//     discount_amount: 100000,
//     min_purchase_amount: 2000000,
//   });
// }
