import User from "../../model/user.js";
import Role from "../../model/role.js";
import bcrypt from "bcryptjs";
import { signupSchema } from "../../schema/auth.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";
dotenv.config();

export const register = async (req, res) => {
  const {
    user_email,
    user_password,
    user_fullname,
    user_username,
    user_confirmPassword,

    role_id,
  } = req.body;
  const formData = req.body;
  try {
    const { error } = signupSchema.validate(formData, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    const userEmailExist = await User.findOne({ user_email });
    console.log(userEmailExist);
    if (
      userEmailExist !== null &&
      (userEmailExist || !userEmailExist.isVerified)
    ) {
      return res.status(201).json({
        message: "Vui lòng kích hoạt tài khoản của bạn để có thể sử dụng",
        success: 1,
      });
    }

    if (
      userEmailExist !== null &&
      (userEmailExist || !userEmailExist.isVerified)
    ) {
      return res.status(400).json({
        message: "Email đã tồn tại",
      });
    }

    const usernameExist = await User.findOne({ user_username });
    if (
      usernameExist !== null &&
      (usernameExist || !usernameExist.isVerified)
    ) {
      return res.status(201).json({
        message: "Vui lòng kích hoạt tài khoản của bạn để có thể sử dụng",
        success: 1,
      });
    }

    if (
      usernameExist !== null &&
      (usernameExist || !usernameExist.isVerified)
    ) {
      return res.status(400).json({
        message: "Tên đăng nhập đã tồn tại",
      });
    }

    const hashPassword = await bcrypt.hash(user_password, 10);

    let RoleName = await Role.findOne({
      role_name: "Customer",
    });

    if (!RoleName) {
      RoleName = await Role.create({ role_name: "Customer" });
    }

    const formRequest = {
      user_email,
      user_password,
      user_username,
      user_fullname,
      user_password: hashPassword,
      role_id: role_id ? role_id : RoleName._id,
    };

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
      html: `<p style="font-size: 16px; color: #002140; font-weight: 600;">Đây là mã kích hoạt tài khoản của bạn <div className="font-bold text-red-400">${verifyToken}</div> </p>`, // html body
    });

    if (!info) {
      return res.status(400).json({
        message:
          "Mã kích hoạt của bạn chưa được gửi đến email. Vui lòng kiểm tra lại <3",
      });
    }

    const user = await User.create(formRequest);

    user.verifyToken = {
      token: verifyToken,
      expiration: tokenExpiration,
    };
    await user.save();

    return res.status(200).json({
      message:
        "Đăng ký tài khoản thành công. Vui lòng kiểm tra email để kích hoạt tài khoản",
      user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};
