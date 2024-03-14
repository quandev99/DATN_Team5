import Category from "../../model/category.js";
import Brand from "../../model/brand.js";
import slugify from "slugify";
import { CategoryAddSchema } from "../../schema/category.js";

export const createCategory = async (req, res) => {
  const { category_name, brand_id } = req.body;
  const formData = req.body;

  try {
    // validate;
    const { error } = CategoryAddSchema.validate(formData);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const normalizedBrandName = category_name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
    const checkName = await Category.findOne({
      category_name: normalizedBrandName,
    });

    if (brand_id) {
      // Kiểm tra xem brand_id có hợp lệ không
      const brand = await Brand.findById(brand_id);
      if (!brand) {
        return res.status(400).json({
          message: "Thương hiệu không hợp lệ",
        });
      }
    }

    let checkNameBrand = await Brand.findOne({
      brand_name: "Chưa phân loại",
    });
    if (!checkNameBrand) {
      checkNameBrand = await Brand.create({
        brand_name: "Chưa phân loại",
      });
    }
    if (checkName) {
      return res.status(400).json({
        message: "Danh mục đã tồn tại",
      });
    }
    if (brand_id) {
      const checkBrand = await Brand.findById({ _id: brand_id });
      if (!checkBrand) {
        return res.status(400).json({
          message: "Thương hiệu Không tồn tại",
        });
      }
    }
    // Tạo slug
    const slug = slugify(category_name, { lower: true });
    let uniqueSlug = await createUniqueSlug(slug);
    const dataCategory = {
      ...formData,
      category_name: normalizedBrandName,
      brand_id: brand_id ? brand_id : checkNameBrand._id,
    };

    const category = await Category.create(dataCategory);
    if (!category || category.length === 0) {
      return res.status(400).json({
        message: "Thêm danh mục thất bại",
      });
    }
    category.slug = uniqueSlug;
    await category.save();
    return res.json({
      success: true,
      message: "Thêm danh mục thành công",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
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
