import Cart from "../../model/cart.js";
import Coupon from "../../model/coupon.js";

export const applyCouponToCart = async (req, res) => {
  const { user_id, coupon_code, totalPrice } = req.body;
  try {
    if (coupon_code === "") {
      const totalOrder = totalPrice;
      return res.status(200).json({
        totalOrder,
        success: true,
      });
    }

    const cart = await Cart.findOne({ user_id });
    if (!cart) {
      return res.status(400).json({ message: "Giỏ hàng không tồn tại." });
    }

    const checkCoupon = await Coupon.findOne({ coupon_code });
    if (!checkCoupon) {
      return res.status(400).json({ message: "Mã giảm giá không tồn tại" });
    }

    if (checkCoupon.isSpecial === true) {
      if (!checkCoupon.users.includes(user_id)) {
        return res
          .status(400)
          .json({ message: "Mã giảm giá không áp dụng được cho bạn." });
      }
    }

    if (Number(totalPrice) < Number(checkCoupon.discount_amount)) {
      return res
        .status(400)
        .json({ message: "Số tiền không đủ điều kiện để sử dụng mã giảm giá" });
    }

    if (checkCoupon.used_by_users.includes(user_id)) {
      return res
        .status(400)
        .json({ message: "Mã giảm giá đã hết lần sử dụng!" });
    }

    if (checkCoupon.expiration_date < new Date()) {
      // Kiểm tra điều kiện áp dụng mã khuyến mãi
      return res.status(400).json({ message: "Mã khuyến mãi đã hết hạn." });
    }

    // Kiểm tra điều kiện áp dụng mã khuyến mãi
    if (checkCoupon.coupon_quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Mã khuyến mãi đã hết số lượng." });
    }

    // Lấy thông tin giỏ hàng của người dùng
    // const cart = await Cart.findOne({
    //   user_id,
    //   _id: cartId,
    // });

    // Kiểm tra xem mã khuyến mãi đã được áp dụng vào giỏ hàng chưa
    // if (cart.coupon_id) {
    //   return res
    //     .status(400)
    //     .json({ message: "Mã khuyến mãi đã được áp dụng vào giỏ hàng" });
    // }

    if (totalPrice <= checkCoupon.min_purchase_amount) {
      return res
        .status(400)
        .json({ message: "Không đủ điều kiện áp dụng mã giảm giá." });
    }

    const totalOrder = totalPrice - checkCoupon.discount_amount;

    // if (coupon.used_by_users && coupon.used_by_users.indexOf(user_id) !== -1) {
    //   cart.coupon_id = coupon._id;
    //   cart.cart_couponPrice = coupon.discount_amount;
    //   await cart.save();
    //   return res.status(200).json({
    //     message: "Mã khuyến mãi đã được áp dụng vào giỏ hàng.",
    //     cart,
    //   });
    // }

    // cart.coupon_id = coupon._id;
    // cart.cart_couponPrice = coupon.discount_amount;
    // await cart.save();
    return res.status(200).json({
      message: "Mã khuyến mãi đã được áp dụng vào giỏ hàng.",
      // cart,
      coupon_id: checkCoupon._id,
      totalOrder,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
