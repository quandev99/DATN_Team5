import Variant_Product from "../model/variant_product.js";
import Product from "../model/product.js";
import Color from "../model/color.js";
import Size from "../model/size.js";
import {
  AddVariantProductSchema,
  updateVariantSchema,
} from "../schema/variant_product.js";

export const getVariantProductID = async (req, res) => {
  const { id } = req.params;
  try {
    const VariantProductId = await Variant_Product.find({
      product_id: id,
    }).populate([
      { path: "size_id", select: "size_name size_code size_is_new" },
      { path: "color_id", select: "color_name color_is_new color_status" },
    ]);
    if (!VariantProductId) {
      return res.status(400).json({
        message: `Không tìm thấy Variant Product có ID ${id}`,
      });
    }
    return res.status(200).json({
      message: `Dữ liệu Variant Product có ID ${id}`,
      VariantProductId,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

export const getVariantProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const VariantProductId = await Variant_Product.findById(id);
    if (!VariantProductId) {
      return res.status(400).json({
        message: `Không tìm thấy Variant Product có ID ${id}`,
      });
    }
    return res.status(200).json({
      message: `Dữ liệu Variant Product có ID ${id}`,
      VariantProductId,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

export const getAllVariantProduct = async (req, res) => {
  const {
    _page = 1,
    _sort = "createAt",
    _limit = 10,
    _order = "asc",
  } = req.query;

  const options = {
    page: _page,
    sort: { [_sort]: _order === "asc" ? -1 : 1 },
    limit: _limit,
  };

  try {
    const variantPros = await Variant_Product.paginate({}, options);
    if (!variantPros || variantPros.length === 0)
      return res.status(400).json({
        message: "Không tìm thấy sản phẩm biến thể nào!",
      });

    return res.status(200).json({
      message: "Lấy danh sách sản phẩm biến thể thành công",
      variantPros: variantPros.docs,
      pagination: {
        currentPage: variantPros.page,
        totalPages: variantPros.totalPages,
        totalItems: variantPros.totalDocs,
      },
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteVariantProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedVariantProduct = await Variant_Product.findOneAndDelete({
      _id: id,
    });

    if (!deletedVariantProduct) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm biến thể",
      });
    }

    const product = await Product.findById(deletedVariantProduct.product_id);
    if (!product) {
      return res.status(400).json({
        message: "Sản phẩm không tồn tại!",
      });
    }

    if (product) {
      product.variant_products.pull({ _id: id });
      await product.save();
    }

    return res.status(200).json({
      message: `Xóa sản phẩm biến thể thành công`,
      deletedVariantProduct,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Lỗi server: xóa sản phẩm biến thể không thành công " + error.message,
    });
  }
};

export const updateVariantProduct = async (req, res) => {
  const { id } = req.params;
  const formData = req.body;
  const { createdAt, updatedAt, ...rest } = req.body;
  const {
    variant_price,
    variant_discount,
    variant_quantity,
    variant_stock,
    product_id,
  } = req.body;
  try {
    const { error } = updateVariantSchema.validate(formData, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const idVariant = await Variant_Product.findById(id);
    if (!idVariant || idVariant.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy thông tin biến thể!",
      });
    }

    const checkIsChange = await Variant_Product.findOne({ ...rest });
    if (checkIsChange) {
      return res.status(400).json({
        message: "Sản phẩm biến thể k có thay đổi",
      });
    }

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(400).json({
        message: "Không tìm thấy sản phẩm với product_id đã cung cấp!",
      });
    }

    const color = await Color.findById(formData.color_id);
    if (!color) {
      return res.status(400).json({
        message: "Không tìm thấy màu sắc với color_id đã cung cấp!",
      });
    }

    if (variant_price < variant_discount) {
      return res.status(400).json({
        message: "Giá sản phẩm khuyến mại phải nhỏ hơn giá gốc",
      });
    }
    if (variant_quantity > variant_stock) {
      return res.status(400).json({
        message:
          "Số lượng bán ra vượt quá số lượng trong kho. Vui lòng nhập lại",
      });
    }

    const size = await Size.findById(formData.size_id);
    if (!size) {
      return res.status(400).json({
        message: "Không tìm thấy kích thước với size_id đã cung cấp!",
      });
    }

    const dataVariant = { ...formData, product_id };

    const variant = await Variant_Product.findByIdAndUpdate(
      { _id: id },
      dataVariant,
      {
        new: true,
      }
    );

    if (!variant || variant.length == 0) {
      return res.status(400).json({
        message: "Cập nhật biến thể thất bại",
      });
    }

    const OldProduct = await Product.findById(idVariant.product_id);

    // if (OldProduct) {
    //   OldProduct.variant_products.pull(id);

    //   product.variant_products.push(id);
    //   await product.save();
    // }

    if (OldProduct) {
      await Product.findByIdAndUpdate(
        {
          _id: OldProduct,
        },
        {
          $pull: { products: variant._id },
        },
        { new: true }
      );

      await Product.findByIdAndUpdate(variant.product_id, {
        $addToSet: { products: variant._id },
      });
    }

    return res
      .status(200)
      .json({ message: "Sửa biến thể thành công", variant, success: true });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

export const createVariantProduct = async (req, res) => {
  const formData = req.body;
  const {
    color_id,
    size_id,
    product_id,
    variant_quantity,
    variant_stock,
    variant_price,
    variant_discount,
  } = req.body;
  try {
    const { error } = AddVariantProductSchema.validate(formData, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    const product = await Product.findById({ _id: product_id });
    if (!product)
      return res.status(400).json({
        message: "Sản phẩm không tồn tại",
      });

    const size = await Size.findById({ _id: size_id });
    if (!size)
      return res.status(400).json({
        message: "Kích thước không tồn tại",
      });

    const color = await Color.findById({ _id: color_id });
    if (!color) {
      return res.status(400).json({
        message: "Màu sắc không tồn tại",
      });
    }

    if (variant_price < variant_discount) {
      return res.status(400).json({
        message: "Giá sản phẩm khuyến mại phải nhỏ hơn giá gốc",
      });
    }

    if (variant_quantity > variant_stock) {
      return res.status(400).json({
        message:
          "Số lượng bán ra vượt quá số lượng trong kho. Vui lòng nhập lại",
      });
    }

    const existingVariant = await Variant_Product.findOne({
      color_id: color_id,
      size_id: size_id,
      product_id: product_id,
    });

    if (existingVariant) {
      return res.status(400).json({
        message: `Sản phẩm biến thể với color: ${color.color_name} và size: ${size.size_name} đã tồn tại rồi.`,
      });
    }

    const variantProduct = await Variant_Product.create(formData);
    await Product.findOneAndUpdate(
      { _id: product_id },
      {
        $addToSet: {
          variant_products: variantProduct._id,
        },
      }
    );

    await Size.findOneAndUpdate(
      { _id: size_id },
      {
        $addToSet: {
          products: variantProduct._id,
        },
      }
    );

    await Color.findOneAndUpdate(
      { _id: color_id },
      {
        $addToSet: {
          products: variantProduct._id,
        },
      }
    );

    product.product_is_new = true;
    product.save();
    await variantProduct.save();
    return res.status(200).json({
      message: "Thêm sản phảm biến thể thành công!",
      variantProduct,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server VariantProduct: " + error.message });
  }
};
