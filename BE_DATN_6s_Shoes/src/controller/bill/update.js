import Bill from "../../model/bill.js";
import Payment_status from "../../model/payment_status.js";
import Product from "../../model/product.js";
import VariantProduct from "../../model/variant_product.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const updateBill = async (req, res) => {
  const { bill_id } = req.params;
  const { payment_status, status } = req.body;
  try {
    const bill = await Bill.findById(bill_id).populate([
      {
        path: "user_id",
        select:
          "user_email user_fullname user_fullname user_avatar user_address user_phone user_username",
      },
      {
        path: "payment_status",
        select: "pStatus_name pStatus_description",
      },
      {
        path: "payment_method",
        select: "pMethod_name pMethod_description",
      },
    ]);

    if (!bill) {
      return res.status(400).json({
        message: "Không tìm thấy hóa đơn!",
      });
    }

    if (!payment_status) {
      return res.status(400).json({
        message: "Trường trạng thái là bắt buộc",
      });
    }

    const checkStatus = await Payment_status.findById(payment_status);
    if (!checkStatus) {
      return res.status(400).json({
        message: "Trạng thái đơn hàng không tồn tại",
      });
    }

    let abortStatus = await Payment_status.findOne({
      pStatus_name: "Pending",
    });

    let DeliveringStatus = await Payment_status.findOne({
      pStatus_name: "Delivering",
    });
    let DeliveredStatus = await Payment_status.findOne({
      pStatus_name: "Delivered",
    });

    let confirmStatus = await Payment_status.findOne({
      pStatus_name: "Confirmed",
    });

    if (!abortStatus) {
      abortStatus = await Payment_status.create({ pStatus_name: "Pending" });
    }

    if (!confirmStatus) {
      confirmStatus = await Payment_status.create({
        pStatus_name: "Confirmed",
      });
    }
    if (!DeliveringStatus) {
      confirmStatus = await Payment_status.create({
        pStatus_name: "Delivering",
      });
    }
    if (!DeliveredStatus) {
      DeliveredStatus = await Payment_status.create({
        pStatus_name: "Delivered",
      });
    }

    if (status) {
      bill.status = status;
    }

    if (payment_status) {
      if (bill.payment_status.pStatus_name === "Pending") {
        bill.payment_status = confirmStatus._id;
        bill.pStatus_name = confirmStatus.pStatus_name;
      } else if (bill.payment_status.pStatus_name === "Confirmed") {
        bill.payment_status = DeliveringStatus._id;
        bill.pStatus_name = DeliveringStatus.pStatus_name;

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
          to: bill.user_email,
          subject: "Cảm ơn bạn đã mua hàng bên shop 6s Shoes 👟",
          html: `<p style="font-size: 16px; color: #002140; font-weight: 600;">Đơn hàng đang được giao đến bạn. Vui lòng để ý điện thoại để có thể nhận hàng. Xin cảm ơn</p>`,
        });

        if (!info) {
          return res.status(400).json({
            message: "Đơn hàng chưa được thông báo về email",
          });
        }
      } else {
        for (const item of bill.products) {
          const productSold = await Product.findById(item.product_id);
          if (productSold) {
            productSold.sold_quantity += item.quantity;
            await productSold.save();
          }

          const product = await VariantProduct.findById(
            item.variant_product_id
          );
          if (product) {
            product.variant_stock -= item.quantity;
            await product.save();
          }
        }
        bill.payment_status = DeliveredStatus._id;
        bill.pStatus_name = DeliveredStatus.pStatus_name;
        bill.status = "Paid";
      }
    }

    await bill.save();

    return res.status(200).json({
      message: "Hóa đơn đã được cập nhật thành công!",
      bill,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
