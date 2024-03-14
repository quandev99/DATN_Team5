import Joi from "joi";
export const SizeAddSchema = Joi.object({
  size_name: Joi.string().max(55).required().messages({
    "string.empty": "Tên giá trị size không được để trống",
    "string.max": "Tên giá trị size không được vượt quá {#limit} ký tự",
    "any.required": "Tên giá trị size là bắt buộc",
  }),
  size_description: Joi.string().max(255).messages({
    "string.max": "Tên giá trị size không được vượt quá 255 ký tự",
  }),
  products: Joi.array(),
  size_is_new: Joi.boolean(),
  size_code: Joi.string().max(55).messages({
    "string.max": "Mã code size không được vượt quá {#limit} ký tự",
  }),
  slug: Joi.string(),
});

export const updateSizeSchema = Joi.object({
  _id: Joi.string(),
  size_name: Joi.string().max(50).required().messages({
    "string.empty": "Tên kích cỡ không được để trống",
    "any.required": "Trường tên kích cỡ là bắt buộc",
  }),
  size_is_new: Joi.boolean(),
  size_image: Joi.object(),
  size_code: Joi.string().max(55).messages({
    "string.max": "Mã code size không được vượt quá #{limit} ký tự",
  }),
  size_description: Joi.string().max(255).messages({
    "string.max": "Mô tả kích cỡ không được vượt quá {#limit} ký tự",
  }),
  products: Joi.array(),
  slug: Joi.string(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});
