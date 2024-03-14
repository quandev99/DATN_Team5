import Banner from "../../model/banner.js";

export const removeBanner = async (req, res) => {
  const { id } = req.params;
  try {
    const banner = await Banner.findOne({ _id: id });
    if (!banner) {
      return res.status(400).json({
        message: "Không tìm thấy banner",
      });
    }

    const deletebanner = await Banner.findByIdAndDelete(id);
    if (!deletebanner) {
      return res.status(400).json({
        message: "Xóa banner không thành công",
      });
    }

    return res.status(200).json({
      message: "Xóa banner thành công",
      banner: deletebanner,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
