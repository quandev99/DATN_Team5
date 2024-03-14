import Cart from "../../model/cart.js";
import User from "../../model/user.js";

export const getCartByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(500).json({ message: "Tài khoản không tồn tại!" });
    }
    const cart = await Cart.findOne({ user_id: user_id }).populate({
      path: "products",
      populate: [
        {
          path: "variant_product_id",
          select:
            "variant_price variant_discount variant_stock variant_quantity ",
        },
        { path: "product_id", select: "product_name" },
        { path: "color_id", select: "color_name" },
        { path: "size_id", select: "size_name" },
      ],
    });

    const a = cart.products.filter(product => product.product_id !== null);
    cart.products = a;
    await cart.save();
    if (!cart)
      return res
        .status(500)
        .json({ message: "Danh sách giỏ hàng không tồn tại!" });
    return res
      .status(200)
      .json({ message: "Danh sách giỏ hàng theo tài khoản!", cart });
  } catch (error) {
    return res.status(500).json({ message: "Error server: " + error.message });
  }
};
