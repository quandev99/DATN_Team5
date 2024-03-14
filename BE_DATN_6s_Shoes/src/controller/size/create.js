import Size from "../../model/size.js";
import { SizeAddSchema } from "../../schema/size.js";

export const createSize = async (req, res) => {
  const formData = req.body;
  const { size_name, size_code } = req.body;

  try {
    const { error } = await SizeAddSchema.validate(formData, {
      abortEarly: false,
    });
    if (error) {
      const errorFormReq = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errorFormReq,
      });
    }
    const normalizedBrandName = size_name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
    const checkName = await Size.findOne({ size_name: normalizedBrandName });
    if (checkName) {
      return res.status(400).json({
        message: "giá trị size đã tồn tại",
      });
    }
    const checkCode = await Size.findOne({ size_code: size_code });
    if (checkCode) {
      return res.status(400).json({
        message: "mã code size không được trùng tên mã code ",
      });
    }
    const size = await Size.create(formData);
    if (!size) {
      return res.status(400).json({
        message: "Thêm màu thất bại",
      });
    }
    size.size_name = normalizedBrandName;
    await size.save();
    return res.json({
      message: "Thêm màu thành công",
      size,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};
