import Product from "../../model/product.js";
import Product_Group from "../../model/group.js";
import Category from "../../model/category.js";
import Brand from "../../model/brand.js";
import { ProductUpdateSchema } from "../../schema/product.js";
import slugify from "slugify";

// update
export const updateProduct = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const { createdAt, updatedAt, ...rest } = req.body;
  const { brand_id, category_id, product_name, group_id } = req.body;
  try {
    const oldproductId = await Product.findById(id);
    if (!oldproductId) {
      return res.status(402).json({ message: "Không tìm thấy sản phẩm!" });
    }

    const { error } = await ProductUpdateSchema.validate(body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    const checkIsChange = await Product.findOne({ ...rest });
    if (checkIsChange) {
      return res.status(400).json({
        message: "Sản phẩm k có thay đổi",
      });
    }

    const productWithSameName = await Product.findOne({ product_name });
    if (productWithSameName && productWithSameName._id.toString() !== id) {
      return res.status(400).json({
        message: "Tên sản phẩm đã tồn tại trong cơ sở dữ liệu",
      });
    }

    if (brand_id) {
      const existBrand = await Brand.findById(brand_id);
      if (!existBrand) {
        return res.status(400).json({
          message: `Thương hiệu có ID ${brand_id} không tồn tại`,
        });
      }
    }

    if (category_id) {
      const existCategory = await Category.findById(category_id);
      if (!existCategory) {
        return res.status(400).json({
          message: `Thương hiệu có ID ${category_id} không tồn tại`,
        });
      }
    }

    if (group_id) {
      const existGroup = await Product_Group.findById(group_id);
      if (!existGroup) {
        return res.status(400).json({
          message: `Nhóm sản phẩm có ID ${group_id} không tồn tại`,
        });
      }
    }

    const oldCategoryId = await oldproductId.category_id;
    const oldBrandId = await oldproductId.brand_id;
    const oldGroupId = await oldproductId.group_id;

    let newSlug = oldproductId.slug;
    newSlug = slugify(product_name, { lower: true });

    const updateProduct = await Product.findOneAndUpdate(
      oldproductId._id,
      { ...req.body, slug: newSlug },
      {
        new: true,
      }
    );

    if (!updateProduct) {
      return res.status(404).json({ message: "Cập nhật sản phẩm thất bại!" });
    }

    // Xóa product ở category cũ
    if (oldCategoryId) {
      await Category.findByIdAndUpdate(
        {
          _id: oldCategoryId,
        },
        {
          $pull: { products: updateProduct._id },
        },
        { new: true }
      );

      await Category.findByIdAndUpdate(updateProduct.category_id, {
        $addToSet: { products: updateProduct._id },
      });
    }

    if (oldBrandId) {
      await Brand.findByIdAndUpdate(
        {
          _id: oldBrandId,
        },
        {
          $pull: { products: updateProduct._id },
        },
        { new: true }
      );

      await Brand.findByIdAndUpdate(updateProduct.brand_id, {
        $addToSet: { products: updateProduct._id },
      });
    }

    if (oldGroupId) {
      await Product_Group.findByIdAndUpdate(
        {
          _id: oldGroupId,
        },
        {
          $pull: { products: updateProduct._id },
        },
        { new: true }
      );

      await Product_Group.findByIdAndUpdate(updateProduct.group_id, {
        $addToSet: { products: updateProduct._id },
      });
    }

    updateProduct.product_is_new = true;
    updateProduct.save();
    return res.status(200).json({
      message: "Cập nhật sản phẩm thành công!",
      products: updateProduct,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Product: " + error.message });
  }
};

export const patchProduct = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  try {
    const oldproductId = await Product.findById(id);
    if (!oldproductId) {
      return res.status(402).json({ message: "Không tìm thấy sản phẩm!" });
    }

    const oldGroupId = await oldproductId.group_id;

    const updateProduct = await Product.findOneAndUpdate(
      oldproductId._id,
      body,
      {
        new: true,
      }
    );

    if (!updateProduct) {
      return res.status(404).json({ message: "Cập nhật sản phẩm thất bại!" });
    }

    // Xóa product ở category cũ
    await Product_Group.findByIdAndUpdate(
      {
        _id: oldGroupId,
      },
      {
        $pull: { products: updateProduct._id },
      },
      { new: true }
    );

    await Product_Group.findByIdAndUpdate(updateProduct.group_id, {
      $addToSet: { products: updateProduct._id },
    });

    return res.status(200).json({
      message: "Cập nhật sản phẩm thành công!",
      products: updateProduct,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Product: " + error.message });
  }
};
