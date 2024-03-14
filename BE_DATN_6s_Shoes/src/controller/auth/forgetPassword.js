import User from "../../model/user.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";
dotenv.config();

export const forgetPassword = async (req, res) => {
  const { user_email } = req.body;
  try {
    const user = await User.findOne({ user_email });
    if (!user)
      return res.status(401).json({
        message: "Tài khoản người dùng không tồn tại!",
      });
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Tài khoản người dùng chưa được kích hoạt hoặc không tồn tại!",
      });
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
    // GỬI EMAILVỚI TRANSPORTER ĐÃ ĐƯỢC CONFIG XONG
    const verifyToken = crypto.randomBytes(3).toString("hex").toUpperCase();
    const tokenExpiration = Date.now() + 2 * 60 * 1000;
    user.verifyToken = {
      token: verifyToken,
      expiration: tokenExpiration,
    };
    await user.save();

    const info = await transporter.sendMail({
      from: `"6s Shoes 👟😘" ${process.env.EMAIL_SENDER}`, // sender address
      to: user?.user_email, // list of receivers
      subject: "Mail xác nhận tài khoản của bạn muốn thay đổi mật khẩu", // Subject line
      html: `<p style="font-size: 16px; color: #002140; font-weight: 600;">Đây là mã xác minh <div className="font-bold text-red-400">${verifyToken}</div>.</p>`,
    });
    if (!info) {
      return res.status(400).json({
        message:
          "Mã kích hoạt của bạn chưa được gửi đến email. Vui lòng kiểm tra lại <3",
      });
    }
    return res
      .status(200)
      .json({ message: "Email xác nhận đã được gửi.", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Erorr server: " + error.message });
  }
};
