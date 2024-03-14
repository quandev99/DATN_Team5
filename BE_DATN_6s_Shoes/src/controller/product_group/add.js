import ProductGroup from "../../model/group.js";
import { GroupSchema } from "../../schema/group.js";

export const addProductGroup = async (req, res) => {
  const formData = req.body;
  const { start_date, end_date, group_name } = req.body;
  try {
    const { error } = await GroupSchema.validate(formData, {
      abortEarly: false,
    });
    if (error) {
      const errorFormReq = error.details.map(err => err.message);
      return res.status(400).json({
        message: errorFormReq,
      });
    }

    if (start_date > end_date) {
      return res.status(400).json({
        message: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc",
      });
    }

    const groupWithSameName = await ProductGroup.findOne({ group_name });
    if (groupWithSameName) {
      return res.status(400).json({
        message: "Tên group đã tồn tại trong cơ sở dữ liệu",
      });
    }

    const groups = await ProductGroup.create(formData);
    if (groups.length === 0) {
      return res.status(404).json({
        message: "Thêm nhóm sản phẩm thất bại",
      });
    }

    return res.status(200).json({
      message: "Thêm nhóm sản phẩm thành công",
      groups,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi máy chủ: " + error.message,
    });
  }
};
