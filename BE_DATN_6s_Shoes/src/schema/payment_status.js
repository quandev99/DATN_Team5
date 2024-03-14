import Joi from "joi";

export const pStatusAddSchema = Joi.object({
  pStatus_name: Joi.string().min(3).max(55).required().messages({
    "string.empty": "Tên trạng thái không được để trống",
    "any.required": "Trường tên trạng thái là bắt buộc",
  }),
  pStatus_description: Joi.string().max(255).messages({
    "string.max": "Mô tả trạng thái không được vượt quá {#limit} ký tự",
  }),
  pStatus_reason: Joi.string().max(255).required().messages({
    "string.max": "Trường lý do hủy hàng không được vượt quá {#limit} ký tự",
    "any.required": "Trường lý do hủy hàng là bắt buộc",
  }),
  status: Joi.boolean(),
});
export const pStatusUpdateSchema = Joi.object({
  _id: Joi.string(),
  pStatus_name: Joi.string().min(3).max(55).required().messages({
    "string.empty": "Tên trạng thái không được để trống",
    "any.required": "Trường tên trạng thái là bắt buộc",
    "string.min": "Tên trạng thái không được nhỏ hơn {#limit} ký tự",
    "string.max": "Tên trạng thái không được vượt quá {#limit} ký tự",
  }),
  pStatus_description: Joi.string().max(255).messages({
    "string.max": "Mô tả trạng thái không được vượt quá {#limit} ký tự",
  }),
  pStatus_reason: Joi.string().max(255).required().messages({
    "string.max": "Trường lý do hủy hàng không được vượt quá {#limit} ký tự",
    "any.required": "Trường lý do hủy hàng là bắt buộc",
  }),
  status: Joi.boolean(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});
