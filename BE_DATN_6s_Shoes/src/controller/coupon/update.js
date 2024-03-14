import Coupon from "../../model/coupon.js";
import { updateCouponSchema } from "../../schema/coupon.js";

export const updateCoupon = async (req, res) => {
  const { coupon_name, coupon_code, expiration_date } = req.body;
  const { id } = req.params;
  const formData = req.body;
  const { createdAt, updatedAt, ...rest } = req.body;
  try {
    const idCoupon = await Coupon.findById(id);
    if (!idCoupon || idCoupon.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy thông tin giảm giá!",
      });
    }

    const checkIsChange = await Coupon.findOne({ ...rest });
    if (checkIsChange) {
      return res.status(400).json({
        message: "Thông tin k có thay đổi",
      });
    }

    // Kiểm tra xem danh mục đã tồn tại hay chưa
    const productWithSameName = await Coupon.findOne({ coupon_name });
    if (productWithSameName && productWithSameName._id.toString() !== id) {
      return res.status(400).json({
        message: "Tên mã giảm giá đã tồn tại trong cơ sở dữ liệu",
      });
    }

    const codeWithSameName = await Coupon.findOne({ coupon_code });
    if (codeWithSameName && codeWithSameName._id.toString() !== id) {
      return res.status(400).json({
        message: "Mã code giảm giá đã tồn tại trong cơ sở dữ liệu",
      });
    }

    if (new Date(expiration_date) < new Date()) {
      return res.status(400).json({
        message: "Thời gian hết hạn phải lớn hơn thời gian hiện tại !",
      });
    }

    const { error } = updateCouponSchema.validate(formData, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const dataCoupon = {
      ...formData,
    };

    const coupon = await Coupon.findByIdAndUpdate({ _id: id }, dataCoupon, {
      new: true,
    });
    if (!coupon || coupon.length == 0) {
      return res.status(400).json({
        message: "Cập nhật giảm giá thất bại",
      });
    }
    return res
      .status(200)
      .json({ message: "Cập nhật giảm giá thành công", coupon, success: true });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

export const patchCoupon = async (req, res) => {
  const { coupon_name, coupon_code, expiration_date } = req.body;
  const { id } = req.params;
  const formData = req.body;
  const { createdAt, updatedAt, ...rest } = req.body;
  try {
    const idCoupon = await Coupon.findById(id);
    if (!idCoupon || idCoupon.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy thông tin giảm giá!",
      });
    }

    const checkIsChange = await Coupon.findOne({ ...rest });
    if (checkIsChange) {
      return res.status(400).json({
        message: "Thông tin k có thay đổi",
      });
    }

    // Kiểm tra xem danh mục đã tồn tại hay chưa
    const productWithSameName = await Coupon.findOne({ coupon_name });
    if (productWithSameName && productWithSameName._id.toString() !== id) {
      return res.status(400).json({
        message: "Tên mã giảm giá đã tồn tại trong cơ sở dữ liệu",
      });
    }

    const codeWithSameName = await Coupon.findOne({ coupon_code });
    if (codeWithSameName && codeWithSameName._id.toString() !== id) {
      return res.status(400).json({
        message: "Mã code giảm giá đã tồn tại trong cơ sở dữ liệu",
      });
    }

    const { error } = updateCouponSchema.validate(formData, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const dataCoupon = {
      ...formData,
    };

    const coupon = await Coupon.findByIdAndUpdate({ _id: id }, dataCoupon, {
      new: true,
    });
    if (!coupon || coupon.length == 0) {
      return res.status(400).json({
        message: "Cập nhật giảm giá thất bại",
      });
    }
    return res
      .status(200)
      .json({ message: "Cập nhật giảm giá thành công", coupon, success: true });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};
