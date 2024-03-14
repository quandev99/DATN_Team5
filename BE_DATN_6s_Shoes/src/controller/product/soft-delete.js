import Product from "../../model/product.js";
import Brand from "../../model/brand.js";
import Category from "../../model/category.js";
import Group from "../../model/group.js";
import Review from "../../model/review.js";
import Variant_product from "../../model/variant_product.js";

export const getAllDeleted = async (req, res) => {
  try {
    const deletedProducts = await Product.findWithDeleted({ deleted: true });
    if (!deletedProducts || deletedProducts.length === 0) {
      return res.status(400).json({
        message: "Không có sản phẩm nào trong thùng rác",
      });
    }
    return res.status(200).json({
      message: "Lấy tất cả dữ liệu sản phẩm đã bị xóa",
      products: deletedProducts,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Tìm sản phẩm cần xóa
    const deletedProduct = await Product.findById(productId);
    if (!deletedProduct) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    await deletedProduct.delete();

    return res.status(200).json({
      message: "Xóa sản phẩm thành công",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server: xóa sản phẩm không thành công " + error.message,
    });
  }
};

export const deleteForce = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.deleteOne({ _id: id });
    if (!product) {
      return res.status(400).json({
        message: "Xoá sản phẩm vĩnh viễn thất bại",
        product,
        success: true,
      });
    }

    await Variant_product.deleteMany({ product_id: id });

    await Category.updateMany({ products: id }, { $pull: { products: id } });

    await Brand.updateMany({ products: id }, { $pull: { products: id } });

    await Group.updateMany({ products: id }, { $pull: { products: id } });

    await Review.deleteMany({ product_id: id });

    return res.status(200).json({
      message: "Xoá sản phẩm vĩnh viễn thành công",
      product,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

export const restoreProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const restoredProduct = await Product.restore({ _id: id }, { new: true });
    if (!restoredProduct) {
      return res.status(400).json({
        message: "Sản phẩm không tồn tại hoặc đã được khôi phục trước đó.",
      });
    }

    return res.status(200).json({
      message: "Khôi phục sản phẩm thành công.",
      product: restoredProduct,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
