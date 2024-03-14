import Joi from "joi";

export const ColorAddSchema = Joi.object({
  color_name: Joi.string().max(50).required().messages({
    "string.empty": "Tên màu không được để trống",
    "any.required": "Trường tên màu là bắt buộc",
  }),
  color_description: Joi.string().max(255).messages({
    "string.max": "Mô tả màu không được vượt quá {#limit} ký tự",
  }),
  color_image: Joi.object(),
  color_code: Joi.string(),
});
export const colorUpdateSchema = Joi.object({
  _id: Joi.string(),
  color_name: Joi.string().max(50).required().messages({
    "string.empty": "Tên màu sắc không được để trống",
    "any.required": "Trường tên màu sắc là bắt buộc",
    "string.max": "Mô tả màu sắc không được vượt quá {#limit} ký tự",
  }),
  color_description: Joi.string().max(255).messages({
    "string.max": "Mô tả màu sắc không được vượt quá {#limit} ký tự",
  }),
  color_code: Joi.string().max(50),
  color_image: Joi.object(),
  color_is_featured: Joi.boolean(),
  color_is_new: Joi.boolean(),
  color_status: Joi.boolean(),
  slug: Joi.string(),
  products: Joi.array(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});
