import Joi from "joi";

export const CategoryAddSchema = Joi.object({
  category_name: Joi.string().max(55).required().messages({
    "string.empty": "Tên danh mục không được để trống",
    "any.required": "Trường tên danh mục là bắt buộc",
  }),
  category_description: Joi.string().max(255),
  category_image: Joi.object(),
  brand_id: Joi.string(),
  products: Joi.array(),
});

export const updateCategorySchema = Joi.object({
  _id: Joi.string(),
  category_name: Joi.string().max(55).required().messages({
    "string.empty": "Tên danh mục không được để trống",
    "any.required": "Trường tên danh mục là bắt buộc",
    "string.max": "Mô tả danh mục không được vượt quá {#limit} ký tự",
  }),
  category_image: Joi.object(),
  category_is_featured: Joi.boolean(),
  category_is_new: Joi.boolean(),
  category_status: Joi.boolean(),
  category_description: Joi.string().max(255).messages({
    "string.max": "Mô tả danh mục không được vượt quá {#limit} ký tự",
  }),
  brand_id: Joi.string(),
  products: Joi.array(),
  category_default: Joi.boolean(),
  slug: Joi.string(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});
