import ProductGroup from "../../model/group.js";
import { GroupSchema } from "../../schema/group.js";
import Variant_Product from "../../model/variant_product.js";

export const updateProductGroup = async (req, res) => {
  const formData = req.body;
  const { id } = req.params;

  try {
    const group = await ProductGroup.findById(id).populate("products");
    if (group.length === 0 || !group) {
      return res.status(404).json({
        message: "Không tìm thấy dữ liệu",
      });
    }

    const { error } = await GroupSchema.validate(formData, {
      abortEarly: false,
    });
    if (error) {
      const errorFormReq = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errorFormReq,
      });
    }

    const groups = await ProductGroup.findByIdAndUpdate(id, formData, {
      new: true,
    });
    if (groups.length === 0) {
      return res.status(404).json({
        message: "Cập nhật nhóm sản phẩm thất bại",
      });
    }
    if (formData.products && formData.products.length > 0) {
      for (const product of formData.products) {
        const variants = await Variant_Product.find({
          product_id: product._id,
        });

        for (const variant of variants) {
          variant.variant_quantity = variant.variant_price;
          await variant.save();
        }
      }
    }

    return res.status(200).json({
      message: "Cập nhật nhóm sản phẩm thành công",
      groups,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi máy chủ: " + error.message,
    });
  }
};

export const patchGroup = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  try {
    const oldgrouptId = await ProductGroup.findById(id);
    if (!oldgrouptId) {
      return res
        .status(402)
        .json({ message: "Không tìm thấy thông tin chiến dịch!" });
    }

    const updateGroup = await ProductGroup.findOneAndUpdate(
      oldgrouptId._id,
      body,
      {
        new: true,
      }
    );

    if (!updateGroup) {
      return res
        .status(404)
        .json({ message: "Cập nhật chiến dịch  thất bại!" });
    }

    return res.status(200).json({
      message: "Cập nhật chiến dịch thành công!",
      products: updateProduct,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Product: " + error.message });
  }
};
