import Joi from "joi";

export const CreateBillSchema = Joi.object({
  _id: Joi.string(),
  user_id: Joi.string().required().messages({
    "string.empty": "UserID Sản phẩm bắt buộc nhập",
    "any.required": "Trường UserID bắt buộc nhập",
    "string.base": "UserID phải là chuỗi",
  }),
  bill_shippingAddress: Joi.string().max(100).required().messages({
    "string.empty": "Địa chỉ không được để trống",
    "string.max": "Địa chỉ không được vượt quá {#limit} ký tự",
    "any.required": "Địa chỉ là bắt buộc",
  }),
  payment_method: Joi.string().required(),
  bill_note: Joi.string(),
  bill_code: Joi.string(),
  bill_totalPrice: Joi.number(),
  bill_shippingFee: Joi.number(),
  bill_totalOrder: Joi.number(),
  coupon_id: Joi.string(),
  bill_status: Joi.string(),
  pStatus_name: Joi.string(),
  payment_method: Joi.string(),
  products: Joi.array().required(),
  status: Joi.boolean(),
  bill_details: Joi.boolean(),
  bill_phone: Joi.string().max(10).required().messages({
    "string.empty": "Mời điền số điện thoại",
    "any.required": "Bắt buộc thêm số điện thoại",
    "string.max": "Số phải phải có ít hơn 10 số",
  }),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});
