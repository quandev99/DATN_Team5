import Banner from "../../model/banner.js";

export const createBanner = async (req, res) => {
  const formData = req.body;
  try {
    const displayOrder = await Banner.findOne({display_order:req.body.display_order})
    if (displayOrder)
      return res.status(400).json({
        message: "Vị trí ảnh đã có!",
      });
    const banner = await Banner.create(formData);
    if (!banner || banner.length === 0) {
      return res.status(400).json({
        message: "Thêm banner thất bại",
      });
    }

    return res.status(200).json({
      message: "Thêm banner thành công",
      banner,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};
