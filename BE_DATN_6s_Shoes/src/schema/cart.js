import Joi from "joi";

export const AddToCartSchema = Joi.object({
  user_id: Joi.string().required().messages({
    "string.empty": "Trường tài khoản không được để trống",
    "any.required": "Bạn chưa đăng nhập.Vui lòng đăng nhập",
    "string.base": "Trường tài khoản phải là chuỗi",
  }),
  variantProductId: Joi.string().required().messages({
    "string.empty": "ID biến thể là bắt buộc nhập",
    "any.required": "Trường ID biến thể bắt buộc nhập",
    "string.base": "ID biến thể phải là chuỗi",
  }),
  quantity: Joi.number().min(1).required().messages({
    "number.min": "Số lượng phải lớn hơn hoặc bằng 1",
    "number.empty": "Số lượng không được để trống",
    "any.required": "Trường số lượng là bắt buộc",
  }),
});
