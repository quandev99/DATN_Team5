import slugify from "slugify";
import Brand from "../../model/brand.js";
import { BrandAddSchema } from "../../schema/brand.js";

export const createBrand = async (req, res) => {
  const formData = req.body;
  let { brand_name } = req.body;

  brand_name = brand_name.trim();

  brand_name = brand_name.replace(/\s+/g, " ");
  try {
    const { error } = await BrandAddSchema.validate(formData, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    //
    const normalizedBrandName = brand_name.toLowerCase();

    const checkName = await Brand.findOne({ brand_name: normalizedBrandName });

    if (checkName) {
      return res.status(400).json({
        message:
          "Tên Thương Hiệu Đã Bị Trùng Vui Lòng Chọn Những Tiêu chuẩn nghĩa khác nhau",
      });
    }
    const slug = slugify(brand_name, { lower: true });
    let uniqueSlug = await createUniqueSlug(slug);
    const dataBrand = {
      ...formData,
      slug: uniqueSlug.toLowerCase(),
      brand_name: normalizedBrandName,
    };
    const brand = await Brand.create(dataBrand);

    brand.slug = uniqueSlug;
    await brand.save();

    if (!brand) {
      return res.status(400).json({
        message: "Lỗi thêm thương hiệu :((",
      });
    }

    return res.status(200).json({
      message: "Thêm thương hiệu thành công !",
      brand,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error Server!" + error.message,
    });
  }
};

async function createUniqueSlug(slug) {
  let uniqueSlug = slug;
  let counter = 1;
  while (true) {
    const existingBrand = await Brand.findOne({ slug: uniqueSlug });
    if (!existingBrand) {
      break;
    }
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
}
