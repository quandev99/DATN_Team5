import Cart from "../../model/cart.js";

export const deleleAllProductCart = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      return res.status(400).json({
        message: "Không tìm thấy giỏ hàng!",
      });
    }

    cart.products = [];
    cart.cart_totalPrice = 0;
    cart.cart_totalOrder = 0;

    await cart.save();
    return res.status(200).json({
      message: "Xóa tất cả sản phẩm trong giỏ hàng thành công!",
      cart,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProductCart = async (req, res) => {
  const { user_id, variant_product_id } = req.body;

  try {
    let cart = await Cart.findOne({ user_id: user_id });
    if (!cart || cart.products.length === 0) {
      return res
        .status(400)
        .json({ message: "Không tìm thấy sản phẩm trong giỏ hàng!" });
    }
    cart.products = cart.products.filter(
      (product) => product.variant_product_id != variant_product_id
    );

    await cart.save();

    return res
      .status(200)
      .json({ message: "Xóa sản phẩm thành công!", cart, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
