import Product from "../../model/product.js";
import Product_Gorup from "../../model/group.js";
import Category from "../../model/category.js";
import Brand from "../../model/brand.js";
import { ProductAddSchema } from "../../schema/product.js";
import slugify from "slugify";

export const createProduct = async (req, res) => {
  const { product_name, category_id, brand_id, group_id } = req.body;
  const formData = req.body;

  const trimmedProductName = product_name.replace(/\s+/g, " ").trim();
  try {
    if (category_id) {
      const category = await Category.findById(category_id);
      if (!category) {
        return res.status(400).json({
          message: "Category không tồn tại",
        });
      }
    }

    if (brand_id) {
      const brand = await Brand.findById(brand_id);
      if (!brand) {
        return res.status(400).json({
          message: "Thương hiệu không tồn tại",
        });
      }
    }

    if (group_id) {
      const group = await Product_Gorup.findById(group_id);
      if (!group) {
        return res.status(400).json({
          message: "Nhóm sản phẩm không tồn tại",
        });
      }
    }

    let checkNameCate = await Category.findOne({
      category_name: "Chưa phân loại",
    });
    if (!checkNameCate) {
      checkNameCate = await Category.create({
        category_name: "Chưa phân loại",
      });
    }

    let checkNameBrand = await Brand.findOne({
      brand_name: "Chưa phân loại",
    });

    if (!checkNameBrand) {
      checkNameBrand = await Brand.create({
        brand_name: "Chưa phân loại",
      });
    }

    let checkNameGroup = await Product_Gorup.findOne({
      group_name: "Chưa phân loại",
    });

    if (!checkNameGroup) {
      checkNameGroup = await Product_Gorup.create({
        group_name: "Chưa phân loại",
      });
    }

    const checkName = await Product.findOne({
      product_name: trimmedProductName,
    });
    if (checkName) {
      return res.status(400).json({
        message: "Sản phẩm đã tồn tại",
      });
    }

    const { error } = ProductAddSchema.validate(formData);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const slug = slugify(trimmedProductName, { lower: true });
    let uniqueSlug = await createUniqueSlug(slug);

    const dataPro = {
      ...formData,
      slug: uniqueSlug,
      product_name: trimmedProductName,
      category_id: category_id ? category_id : checkNameCate._id,
      brand_id: brand_id ? brand_id : checkNameBrand._id,
      group_id: group_id ? group_id : checkNameGroup._id,
    };

    const product = await Product.create(dataPro);
    if (!product || product.length === 0) {
      return res.status(400).json({
        message: "Thêm sản phẩm thất bại",
      });
    }

    await Category.findByIdAndUpdate(
      category_id ? category_id : checkNameCate._id,
      {
        $addToSet: {
          products: product._id,
        },
      }
    );

    await Brand.findByIdAndUpdate(brand_id ? brand_id : checkNameBrand._id, {
      $addToSet: {
        products: product._id,
      },
    });

    await Product_Gorup.findByIdAndUpdate(
      group_id ? group_id : checkNameGroup._id,
      {
        $addToSet: {
          products: product._id,
        },
      }
    );

    product.slug = uniqueSlug;
    await product.save();

    return res.status(200).json({
      message: "Thêm sản phẩm thành công",
      product,
      success: true,
    });
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
    const existingProduct = await Product.findOne({ slug: uniqueSlug });
    if (!existingProduct) {
      break;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
