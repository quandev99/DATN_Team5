import slugify from "slugify";
import Brand from "../../model/brand.js";
import { BrandUpdateSchema } from "../../schema/brand.js";

export const updateBrand = async (req, res) => {
  const { id } = req.params;
  const formData = req.body;
  const { brand_name } = req.body;
  const { createdAt, updatedAt, ...rest } = req.body;
  try {
    const { error } = BrandUpdateSchema.validate(formData, {
      abortEarly: false,
    });
    if (error) {
      const errorFormReq = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errorFormReq,
      });
    }

    const brand = await Brand.findById(id);
    if (!brand) res.status(400).json({ message: "Thương hiệu không tồn tại!" });

    const checkIsChange = await Brand.findOne({ ...rest });
    if (checkIsChange) {
      return res.status(400).json({
        message: "Thương hiệu k có thay đổi",
        brand,
      });
    }

    const productWithSameName = await Brand.findOne({ brand_name });
    if (productWithSameName && productWithSameName._id.toString() !== id) {
      return res.status(400).json({
        message: "Tên thương hiệu đã tồn tại trong cơ sở dữ liệu",
      });
    }

    const exitSlug = slugify(brand_name, { lower: true });
    let newSlug = await createUniqueSlug(exitSlug);
    const data = {
      ...req.body,
      slug: newSlug,
    };

    const newBrand = await Brand.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    if (!newBrand) {
      return res.status(400).json({ message: "Cập nhật thương hiệu thất bại" });
    }
    return res.status(200).json({
      message: "Cập nhật thương hiệu thành công!",
      brand: newBrand,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error Server: " + error.message });
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
