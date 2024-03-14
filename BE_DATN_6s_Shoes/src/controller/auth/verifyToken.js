import User from "../../model/user.js";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = async (req, res) => {
  const { user_email, verifyToken } = req.body;
  try {
    const user = await User.findOne({ user_email });
    if (!user) {
      return res.status(400).json({
        message: "Không tìm thấy tài khoản để xác minh!",
      });
    }

    if (!verifyToken) {
      return res.status(400).json({
        message: "Bạn chưa nhập mã xác minh!",
      });
    }

    const token = await User.findOne({
      "verifyToken.token": verifyToken,
    });
    if (!token) {
      return res.status(400).json({
        message: "Liên kết xác nhận không hợp lệ vui lòng xác nhận lại!",
      });
    }
    const storeToken = user.verifyToken.token;

    const expirationTime = user.verifyToken.expiration;
    if (Date.now() > expirationTime) {
      return res.status(400).json({
        message: "Mã xác minh đã hết hạn. Vui lòng yêu cầu lại mã.",
      });
    }

    if (!verifyToken || (verifyToken && verifyToken !== storeToken)) {
      return res.status(400).json({
        message: "Mã xác minh không hợp lệ! Vui lòng kiểm tra lại!",
      });
    }

    user.verifyToken = null;
    await user.save();

    res.status(200).json({
      message: "Xác minh thành công. Bạn có thể đổi lại mật khẩu ngay bây giờ",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error server" + error.message });
  }
};

export const verifyUser = async (req, res) => {
  const { user_email, verifyToken } = req.body;
  try {
    const user = await User.findOne({ "verifyToken.token": verifyToken });
    if (!user) {
      return res.status(400).json({
        message: "Liên kết xác nhận không hợp lệ.",
      });
    }

    if (Date.now() > user.verifyToken.expiration) {
      return res.status(400).json({
        message:
          "Liên kết xác nhận đã hết hạn. Vui lòng yêu cầu lại mã xác nhận.",
      });
    }

    user.isVerified = true;
    user.verifyToken = null;
    await user.save();

    return res.status(200).json({
      message: "Xác nhận thành công. Bạn có thể đăng nhập ngay bây giờ.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};
