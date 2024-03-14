import Category from "../../model/category.js";
import Brand from "../../model/brand.js";
import slugify from "slugify";
import { updateCategorySchema } from "../../schema/category.js";

export const updateCategory = async (req, res) => {
  const { createdAt, updatedAt, ...rest } = req.body;
  const { category_name, brand_id } = req.body;
  const { id } = req.params;
  const formData = req.body;
  try {
    const oldidCate = await Category.findById(id);
    if (!oldidCate || oldidCate.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy thông tin danh mục!",
      });
    }

    const oldBrandId = await oldidCate.brand_id;

    const checkIsChange = await Category.findOne({ ...rest });
    if (checkIsChange) {
      return res.status(400).json({
        message: "Danh mục không có chỉnh sửa",
        category: oldidCate,
      });
    }

    const productWithSameName = await Category.findOne({ category_name });
    if (productWithSameName && productWithSameName._id.toString() !== id) {
      return res.status(400).json({
        message: "Tên danh mục đã tồn tại trong cơ sở dữ liệu",
      });
    }

    const { error } = updateCategorySchema.validate(formData, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const checkBrand = await Brand.findById({ _id: brand_id });
    if (!checkBrand) {
      return res.status(400).json({
        message: "Thương hiệu Không tồn tại",
      });
    }

    // Tạo slug
    const slug = slugify(category_name, { lower: true });
    let uniqueSlug = await createUniqueSlug(slug);

    const dataCate = { ...formData, slug: uniqueSlug };

    const category = await Category.findByIdAndUpdate(
      { _id: oldidCate._id },
      dataCate,
      {
        new: true,
      }
    );

    if (!category || category.length == 0) {
      return res.status(400).json({
        message: "Cập nhật danh mục thất bại",
      });
    }

    await Brand.findByIdAndUpdate(
      {
        _id: oldBrandId,
      },
      {
        $pull: { categories: category._id },
      },
      { new: true }
    );

    await Brand.findByIdAndUpdate(category.brand_id, {
      $addToSet: { products: category._id },
    });

    return res
      .status(200)
      .json({ message: "Sửa danh mục thành công", category, success: true });
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
    const existingCategory = await Category.findOne({ slug: uniqueSlug });
    if (!existingCategory) {
      break;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
