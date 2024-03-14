import User from "../../model/user.js";
import bcrypt from "bcryptjs";
import { changePasswordSchema } from "../../schema/auth.js";
import dotenv from "dotenv";
dotenv.config();

export const changePasswordForget = async (req, res) => {
  const { user_email, newPassword, rePassword } = req.body;

  try {
    if (!newPassword) {
      return res.status(400).json({
        message: "Bạn chưa nhập mật khẩu mới",
      });
    }
    if (!rePassword) {
      return res.status(400).json({
        message: "Bạn chưa xác nhận mật khẩu mới",
      });
    }

    const user = await User.findOne({ user_email });
    if (!user) {
      return res.status(400).json({
        message: "Tài khoản không tồn tại",
      });
    }

    const sameOldPasword = await bcrypt.compare(
      newPassword,
      user.user_password
    );
    if (sameOldPasword) {
      return res.status(400).json({
        message: "Bạn vừa nhập lại mật khẩu cũ. Vui lòng điền mật khẩu khác",
      });
    }

    const reCheckPassword = await bcrypt.compare(
      rePassword,
      user.user_password
    );

    if (reCheckPassword) {
      return res.status(400).json({
        message: "Bạn chưa xác nhận lại mật khẩu mới. Vui lòng nhập lại",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    const userChangePassword = await User.findByIdAndUpdate(
      { _id: user._id },
      { user_password: hashPassword },
      { new: true }
    );

    return res.status(200).json({
      message: "Thay đổi mật khẩu thành công!",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.messag || "Lỗi server",
    });
  }
};

export const changePasswordNew = async (req, res) => {
  const { user_password, user_email, newPassword, rePassword } = req.body;

  try {
    const { error } = changePasswordSchema.validate(req.body, {
      abortEarly: false,
    });
    const user = await User.findOne({ user_email });
    if (!user) {
      return res.status(400).json({
        message: "Tài khoản không tồn tại",
      });
    }

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    const checkPassword = await bcrypt.compare(
      user_password,
      user.user_password
    );
    if (!checkPassword) {
      return res.status(400).json({
        message: "Mật khẩu cũ không chính xác. Vui lòng nhập lại",
      });
    }

    const sameOldPasword = await bcrypt.compare(
      newPassword,
      user.user_password
    );
    if (sameOldPasword) {
      return res.status(400).json({
        message: "Bạn vừa nhập lại mật khẩu cũ. Vui lòng điền mật khẩu khác",
      });
    }

    const reCheckPassword = await bcrypt.compare(
      rePassword,
      user.user_password
    );

    if (reCheckPassword) {
      return res.status(400).json({
        message: "Bạn chưa xác nhận lại mật khẩu mới. Vui lòng nhập lại",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    const userChangePassword = await User.findByIdAndUpdate(
      { _id: user._id },
      { user_password: hashPassword },
      { new: true }
    );

    return res.status(200).json({
      message: "Thay đổi mật khẩu thành công!",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.messag || "Lỗi server",
    });
  }
};
