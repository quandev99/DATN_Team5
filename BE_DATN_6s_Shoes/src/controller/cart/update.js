import Cart from "../../model/cart.js";
import Variant_Product from "../../model/variant_product.js";

export const updateCart = async (req, res) => {
  const { user_id, variantProductId, quantity, isCheckbox } = req.body;
  try {
    if (!user_id) {
      return res.status(400).json({
        message: `Bạn cần đăng nhập mới thực hiện được chức năng này`,
      });
    }
    const cart = await Cart.findOne({ user_id });

    if (!cart) {
      return res.status(400).json({ message: "Không tìm thấy giỏ hàng!" });
    }

    const variantProduct = cart.products.find(
      (product) => product.variant_product_id == variantProductId
    );

    if (!variantProduct) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm trong giỏ hàng!" });
    }

    const getVariantProductPrice = await Variant_Product.findById(
      variantProductId
    ).populate({ path: "product_id", select: "product_name product_image" });

    if (!getVariantProductPrice) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm trong giỏ hàng!" });
    }

    variantProduct.quantity = quantity;

    variantProduct.price = getVariantProductPrice.variant_discount
      ? getVariantProductPrice.variant_discount * quantity
      : getVariantProductPrice.variant_price * quantity;

    await cart.save();
    return res
      .status(200)
      .json({ message: "Giỏ hàng đã được cập nhật thành công!", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
