import User from "../../model/user.js";
import Role from "../../model/role.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";
import slugify from "slugify";
import { createUserSchema } from "../../schema/user.js";
dotenv.config();

export const createUserProfile = async (req, res) => {
  const {
    user_email,
    user_password,
    user_fullName,
    user_username,
    user_confirmPassword,
    role_id,
    ...rest
  } = req.body;
  const formData = req.body;
  try {
    // VALIDATE
    const { error } = createUserSchema.validate(formData, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    const userEmailExist = await User.findOne({ user_email });
    if (userEmailExist) {
      return res.status(400).json({
        message: "Email người dùng đã tồn tại",
      });
    }

    const usernameExist = await User.findOne({ user_username });
    if (usernameExist) {
      return res.status(400).json({
        message: "Tên tài khoản đã tồn tại",
      });
    }

    // check Category có tồn tại hay k
    if (role_id) {
      const existRole = await Role.findById(role_id);
      if (!existRole) {
        return res.status(400).json({
          message: `Vai trò có ID ${role_id} không tồn tại`,
        });
      }
    }

    const hashPassword = await bcrypt.hash(user_password, 10);

    // Tạo slug
    const slug = slugify(user_username, { lower: true });
    let uniqueSlug = await createUniqueSlug(slug);

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
      role_id: role_id ? role_id : RoleName._id,
      user_password: hashPassword,
      ...rest,
      slug: uniqueSlug,
    };
    const user = await User.create(formRequest);

    user.slug = uniqueSlug;
    await user.save();

    const verifyToken = crypto.randomBytes(3).toString("hex").toUpperCase();
    const tokenExpiration = Date.now() + 3 * 24 * 60 * 60 * 1000;

    const verificationLink = `http://localhost:8080/api/users/verify/${verifyToken}`;

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
      to: user_email,
      subject: "Xác nhận tài khoản",
      html: `<p style="font-size: 16px; color: #002140; font-weight: 600;">Nhấp vào <a href="${verificationLink}">đây</a> để xác nhận tài khoản.</p>`,
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

    return res.status(200).json({
      message:
        "Đăng ký tài khoản thành công. Mã kích hoạt tài khoản của bạn đã được gửi đến email. Vui lòng kiểm tra lại <3",
      user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

async function createUniqueSlug(slug) {
  let uniqueSlug = slug;
  let counter = 1;
  while (true) {
    const existingUser = await User.findOne({ slug: uniqueSlug });
    if (!existingUser) {
      break;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
