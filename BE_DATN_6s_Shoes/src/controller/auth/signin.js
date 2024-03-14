import User from "../../model/user.js";
import Role from "../../model/role.js";
import bcrypt from "bcryptjs";

import {
  generalAccessToken,
  generalRefreshToken,
} from "../../service/jwtService.js";

import dotenv from "dotenv";
import { signinSchema } from "../../schema/auth.js";

dotenv.config();

export const signin = async (req, res) => {
  const { user_email, user_password } = req.body;
  try {
    const { error } = signinSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(err => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    let user = await User.findOne({ user_email });
    if (!user) {
      return res.status(400).json({
        message: "Tài khoản không tồn tại",
      });
    }

    if (user.user_status === false) {
      return res.status(400).json({
        message: "Tài khoản bị khóa",
      });
    }

    if (user.isVerified === false) {
      return res.status(400).json({
        message: "Bạn hãy kiểm tra và xác thực tài khoản đề đăng nhập nhé ",
      });
    }

    if (
      user.user_password !== undefined &&
      typeof user.user_password === "string"
    ) {
      const isMatch = await bcrypt.compare(user_password, user.user_password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Mật khẩu không đúng",
        });
      }
    }
    const checkPass = await bcrypt.compare(user_password, user.user_password);

    let roleName = await Role.findById(user?.role_id);
    const role_name = roleName?.role_name;
    if (user && checkPass) {
      const accessToken = generalAccessToken({
        _id: user._id,
        role_name,
      });

      const refreshToken = generalRefreshToken({
        _id: user._id,
        role_id: user.role_id,
        slug: user.slug,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      await user.save();
      return res.status(200).json({
        message: "Đăng nhập thành công",
        accessToken,
        success: true,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || " error server :((",
    });
  }
};
