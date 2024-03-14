import User from "../../model/user.js";

export const banUser = async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findOne({ _id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user && user.user_status === true) {
      const result = await User.findByIdAndUpdate(
        { _id },
        { $set: { user_status: false } },
        { new: true }
      );
      return res.status(200).json({
        message: "Ban tài khoản người dùng thành công!",
        data: result,
        success: true,
      });
    } else {
      const result = await User.findByIdAndUpdate(
        { _id },
        { $set: { user_status: true } },
        { new: true }
      );
      return res.status(200).json({
        message: "Khôi phục tài khoản người dùng thành công!",
        data: result,
        success: true,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error server: " + error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.find({ _id: id });
    if (!user) {
      return res.status(400).json({
        message: "không tìm thấy người dùng !",
      });
    }
    const deleteUser = await User.findByIdAndDelete(id);
    if (!deleteUser) {
      return res.status(400).json({
        message: "Lỗi xóa người người dùng !",
      });
    }
    return res.status(200).json({
      message: `xóa tài khoản người dùng thành công !`,
      deleteUser,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "lỗi server :((",
    });
  }
};
