import Coupon from "../../model/coupon.js";
import { CouponSchema } from "../../schema/coupon.js";

export const createCoupons = async (req, res) => {
  const formDataCoupon = req.body;
  const { coupon_name, coupon_code, expiration_date, users } = req.body;
  try {
    const { error } = CouponSchema.validate(formDataCoupon, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    const checkName = await Coupon.findOne({ coupon_name });
    if (checkName) {
      return res.status(400).json({
        message: "tên khuyễn mãi đã tồn tại !",
      });
    }

    if (new Date(expiration_date) < new Date()) {
      return res.status(400).json({
        message: "Thời gian hết hạn phải lớn hơn thời gian hiện tại !",
      });
    }

    const checkCode = await Coupon.findOne({ coupon_code });
    if (checkCode) {
      return res.status(400).json({
        message: "tên mã code giảm giá đã tồn tại !",
      });
    }

    const DataCoupon = {
      ...formDataCoupon,
    };

    const coupon = await Coupon.create(DataCoupon);
    if (!coupon) {
      return res.status(404).json({
        error: "Tạo phiếu giảm giá thất bại",
      });
    }

    return res.status(200).json({
      message: "Tạo phiếu giảm giá thành công",
      coupon,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
