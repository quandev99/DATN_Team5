import Banner from "../../model/banner.js";

export const updateBanner = async (req, res) => {
  const formData = req.body;
  const id = req.params.id;
  try {
    const idBanner = await Banner.findById(req.params.id);
    if (!idBanner || idBanner.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy thông tin banner",
      });
    }
     const displayOrder = await Banner.findOne({
       display_order: req.body.display_order,
     });
     if (displayOrder)
       return res.status(400).json({
         message: "Vị trí ảnh đã có!",
       });

    const banner = await Banner.findByIdAndUpdate(id, formData, {
      new: true,
    });

    if (!banner || banner.length === 0) {
      return res.status(400).json({
        message: "Cập nhật banner thất bại",
      });
    }

    return res
      .status(200)
      .json({ message: "Sửa banner thành công", banner, success: true });
  } catch (error) {
    return res.status(200).json({
      message: error.message || "Lỗi server",
    });
  }
};
