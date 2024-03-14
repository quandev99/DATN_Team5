import Size from "../../model/size.js";
import { updateSizeSchema } from "../../schema/size.js";
import slugify from "slugify";

export const updateSize = async (req, res) => {
  const { size_name } = req.body;
  const { id } = req.params;
  const formData = req.body;
  const { createdAt, updatedAt, ...rest } = req.body;
  try {
    const idSize = await Size.findById(id);
    if (!idSize || idSize.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy thông tin kích cỡ!",
      });
    }

    const checkIsChange = await Size.findOne({ ...rest });
    if (checkIsChange) {
      return res.status(400).json({
        message: "Kích cỡ k có thay đổi",
      });
    }

    const { error } = updateSizeSchema.validate(formData, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const sizeWithSameName = await Size.findOne({ size_name });
    if (sizeWithSameName && sizeWithSameName._id.toString() !== id) {
      return res.status(400).json({
        message: "Tên kích cỡ đã tồn tại trong cơ sở dữ liệu",
      });
    }

    // Tạo slug
    const slug = slugify(size_name, { lower: true });
    let uniqueSlug = await createUniqueSlug(slug);

    const dataSize = { ...formData, slug: uniqueSlug };

    const size = await Size.findByIdAndUpdate({ _id: id }, dataSize, {
      new: true,
    });
    if (!size || size.length == 0) {
      return res.status(400).json({
        message: "Cập nhật kích cỡ thất bại",
      });
    }
    return res
      .status(200)
      .json({ message: "Sửa kích cỡ thành công", size, success: true });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

async function createUniqueSlug(slug) {
  let uniqueSlug = slug;
  let counter = 1;
  while (true) {
    const existingSize = await Size.findOne({
      slug: uniqueSlug,
    });
    if (!existingSize) {
      break;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
