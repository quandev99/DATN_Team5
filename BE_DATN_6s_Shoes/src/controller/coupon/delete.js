import Coupon from "../../model/coupon.js";

export const removeCoupons = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        message: "Xóa phiếu giảm giá thất bại",
      });
    }
    return res.status(200).json({
      message: "Xóa phiếu giảm giá thành công!",
      coupon,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({ message: "Error server" + error.message });
  }
};
