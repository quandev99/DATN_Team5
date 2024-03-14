import Cart from "../../model/cart.js";
import User from "../../model/user.js";
import Variant_Product from "../../model/variant_product.js";
import { AddToCartSchema } from "../../schema/cart.js";

export const addToCart = async (req, res) => {
  const { user_id, variantProductId, quantity = 1 } = req.body;
  try {
    const { error } = AddToCartSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const user = await User.findById(user_id);
    if (!user)
      return res.status(500).json({ message: "Tài khoản không tồn tại!" });

    const variantProduct = await Variant_Product.findById(
      variantProductId
    ).populate([
      { path: "product_id", select: "product_name product_image" },
      { path: "color_id", select: "color_name" },
      { path: "size_id", select: "size_name" },
    ]);
    if (!variantProduct)
      return res.status(500).json({ message: "Sản phẩm không tồn tại!" });

    let cart = await Cart.findOne({ user_id });
    if (!cart) {
      cart = new Cart({
        user_id,
        products: [],
        cart_totalPrice: 0,
        cart_totalOrder: 0,
        shippingFee: 30000,
      });
      await User.findByIdAndUpdate(user_id, { cart_id: cart._id });
    }
    const existingItem = cart.products.find(
      (item) => item.variant_product_id === variantProductId
    );
    if (quantity > variantProduct?.variant_quantity)
      return res
        .status(402)
        .json({ message: "Sản phẩm đặt hàng vượt quá số lượng kho" });
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price += variantProduct.variant_discount
        ? variantProduct.variant_discount * quantity
        : variantProduct.variant_price * quantity;
    } else {
      cart.products.push({
        variant_product_id: variantProduct._id,
        quantity,
        product_id: variantProduct.product_id._id,
        product_name: variantProduct.product_id.product_name,
        product_image: variantProduct.product_id?.product_image,
        product_quantity: variantProduct.variant_quantity,
        size_id: variantProduct.size_id,
        color_id: variantProduct.color_id,
        size_name: variantProduct.size_id.size_name,
        color_name: variantProduct.color_id.color_name,
        product_price: variantProduct.variant_price,
        product_discount: variantProduct.variant_discount,
        price: variantProduct.variant_discount
          ? variantProduct.variant_discount * quantity
          : variantProduct.variant_price * quantity,
      });
    }

    await cart.save();
    return res.status(200).json({
      message: "Sản phẩm đã được thêm vào giỏ hàng!",
      cart,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error server: " + error.message });
  }
};
