import User from "../../model/user.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";
dotenv.config();

export const resetToken = async (req, res) => {
  const { user_email } = req.body;
  try {
    if (!user_email) {
      return res.status(400).json({
        message: "Trường email là bắt buộc!",
      });
    }

    const user = await User.findOne({ user_email });
    if (!user) {
      return res.status(400).json({
        message: "Không tìm thấy tài khoản để xác minh!",
      });
    }

    const verifyToken = crypto.randomBytes(3).toString("hex").toUpperCase();
    const tokenExpiration = Date.now() + 3 * 24 * 60 * 60 * 1000;

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
      from: `"6s Shoes 👟😘" ${process.env.EMAIL_SENDER}`, // sender address
      to: user_email, // list of receivers
      subject: "Xác nhận tài khoản", // Subject line
      html: `<p style="font-size: 16px; color: #002140; font-weight: 600;">Nhấp vào <div className="font-bold text-red-400">${verifyToken}</div> để kích hoạt tài khoản.</p>`, // html body
    });

    if (!info) {
      return res.status(400).json({
        message:
          "Mã kích hoạt của bạn chưa được gửi đến email. Vui lòng kiểm tra lại <3",
      });
    }

    user.verifyToken = {
      token: verifyToken,
      expiration: tokenExpiration,
    };
    await user.save();

    res.status(200).json({
      message: "Mã xác minh đã được gửi về email",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error server" + error.message });
  }
};
