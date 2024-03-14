import Category from "../../model/category.js";
import Brand from "../../model/brand.js";
import Product from "../../model/product.js";

export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const checkNameCate = await Category.findOne({
      category_name: "Chưa phân loại",
    });
    if (categoryId === checkNameCate?._id.toString()) {
      return res.status(400).json({
        message: "Không được phép xóa danh mục 'Chưa phân loại'",
      });
    }

    const deletedCategory = await Category.findOneAndDelete({
      _id: categoryId,
    });

    if (!deletedCategory) {
      return res.status(404).json({
        message: "Xóa danh mục thất bại",
      });
    }

    await Product.updateMany(
      { category_id: categoryId },
      { category_id: checkNameCate._id }
    );

    return res.status(200).json({
      message: `Xóa danh mục: ${deletedCategory.category_name} thành công`,
      category: deletedCategory,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server: xóa danh mục không thành công " + error.message,
    });
  }
};

export const deleteAllProductCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    await Product.deleteMany({ category_id: categoryId });

    const deletedCategory = await Category.findOneAndDelete({
      _id: categoryId,
    });

    if (!deletedCategory) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục",
      });
    }

    await Brand.findByIdAndUpdate(deletedCategory.brand_id, {
      $pull: { products: deletedCategory._id },
    });

    return res.status(200).json({
      message: `Xóa danh mục: ${deletedCategory.category_name} thành công`,
      success: true,
      category: deletedCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server: xóa danh mục không thành công " + error.message,
    });
  }
};
