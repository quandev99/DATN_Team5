import Brand from "../../model/brand.js";
import Product from "../../model/product.js";
import Category from "../../model/category.js";

export const deleteBrand = async (req, res) => {
  const brandId = req.params.id;
  try {
    const brand = await Brand.findOne({ _id: brandId });
    if (!brand || brand.length === 0) {
      return res.status(404).json({
        message: `Không tìm thấy thương hiệu !`,
      });
    }

    const DeleteBrand = await Brand.findByIdAndRemove(brandId);
    if (!DeleteBrand) {
      return res.status(404).json({
        message: ` Xóa thương hiệu Không thành công !`,
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

    await Product.updateMany(
      { brand_id: brandId },
      { brand_id: checkNameBrand._id }
    );

    await Category.updateMany(
      { brand_id: brandId },
      { brand_id: checkNameBrand._id }
    );

    return res.status(200).json({
      message: ` Xóa thương hiệu ${brand.brand_name} thành công !`,
      DeleteBrand,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error server!",
    });
  }
};

export const deleteAllProductBrand = async (req, res) => {
  try {
    const brandId = req.params.id;

    await Product.deleteMany({ brand_id: brandId });
    await Category.deleteMany({ brand_id: brandId });

    const deletedBrand = await Brand.findOneAndDelete({
      _id: brandId,
    });

    if (!deletedCategory) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục",
      });
    }

    return res.status(200).json({
      message: `Xóa danh mục: ${deletedCategory.category_name} thành công`,
      brand: deletedBrand,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server: xóa danh mục không thành công " + error.message,
    });
  }
};
