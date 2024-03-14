import User from "../../model/user.js";
import dotenv from "dotenv";
dotenv.config();

export const test_token_get_user = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản",
      });
    }
    return res.status(200).json({
      user,
      message: "Lấy dữ liệu người dùng thành công",
      success: true,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
