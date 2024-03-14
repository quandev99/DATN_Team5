import Coupon from "../../model/coupon.js";
import Cart from "../../model/cart.js";
import Bill from "../../model/cart.js";

export const applyCoupon = async (req, res) => {
  try {
    const user_id = req.params.id;
    const { coupon_id } = req.body;

    const cart = await Cart.findOne({ user_id });
    if (!cart) {
      return res.status(404).json({
        message:
          "Không tìm thấy sản phẩm nào trong giỏ hàng của người dùng này",
      });
    }
    if (cart.coupon_id != null) {
      return res
        .status(404)
        .json({ message: "Chỉ được sử dụng 1 phiếu giảm giá" });
    }

    const coupon = await Coupon.findById(coupon_id);
    if (cart.cart_totalPrice < coupon.min_purchase_amount) {
      return res
        .status(404)
        .json({ message: "Không đủ điều kiện để sử dụng phiếu giảm giá" });
    }
    if (!coupon) {
      return res
        .status(404)
        .json({ message: "Mã phiếu giảm giá không hợp lệ" });
    }
    const orderWithCoupon = await Bill.findOne({ coupon_id: coupon_id });
    if (orderWithCoupon) {
      return res
        .status(400)
        .json({ message: "Phiếu giảm giá đã được sử dụng" });
    }

    const currentDate = new Date();
    if (currentDate > coupon.expiration_date) {
      return res.status(400).json({ message: "Mã phiếu giảm giá đã hết hạn" });
    }

    const updatedCart = await applyCouponToCart(user_id, coupon_id);

    return res.status(200).json({
      message: "Áp dụng phiếu giảm giá thành công",
      data: updatedCart,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const applyCouponToCart = async (user_id, coupon_id) => {
  try {
    const cart = await Cart.findOne({ user_id });
    const coupon = await Coupon.findById(coupon_id);
    if (coupon.discount_amount) {
      cart.products = cart.products.map((item) => {
        console.log("b", item);
        return {
          ...item,
          originalPrice: item.product_price,
        };
      });

      cart.products = cart.products.map((item) => {
        console.log("a", item);
        const originalItemPrice = item.product_price;
        const discountAmount =
          (coupon.discount_amount / 100) * originalItemPrice;
        const discountedPrice = originalItemPrice - discountAmount;
        return {
          ...item,
          product_price: discountedPrice,
        };
      });
      cart.total = cart.products.reduce(
        (total, item) => total + item.product_price * item.stock_quantity,
        0
      );
      cart.coupon_id = coupon._id;

      const updatedCart = await cart.save();

      return updatedCart;
    }

    return cart;
  } catch (error) {
    throw error;
  }
};
