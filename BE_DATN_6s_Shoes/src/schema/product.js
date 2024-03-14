import Joi from "joi";

export const ProductAddSchema = Joi.object({
  product_name: Joi.string().max(55).required().messages({
    "string.empty": "Tên sản phẩm không được để trống",
    "any.required": "Trường tên sản phẩm là bắt buộc",
    "string.max": "Trường tên sản phẩm không được vượt quá {#limit} ký tự",
  }),
  product_code: Joi.string().max(55).messages({
    "string.max": "Trường mã sản phẩm không được vượt quá {#limit} ký tự",
  }),
  product_image: Joi.object(),
  thumbnail: Joi.array(),
  product_description_short: Joi.string().max(255).messages({
    "string.max": "Mô tả ngắn sản phẩm không được vượt quá {#limit} ký tự",
  }),
  product_description_long: Joi.string().max(5000).messages({
    "string.max": "Mô tả ngắn sản phẩm không được vượt quá {#limit} ký tự",
  }),
  product_view: Joi.number(),
  category_id: Joi.string(),
  variant_products: Joi.array(),
  brand_id: Joi.string(),
  group_id: Joi.string(),
  sold_quantity: Joi.number(),
});

export const ProductUpdateSchema = Joi.object({
  _id: Joi.string(),
  product_name: Joi.string().max(55).required().messages({
    "string.empty": "Tên sản phẩm không được để trống",
    "any.required": "Trường tên sản phẩm là bắt buộc",
    "string.max": "Trường tên sản phẩm không được vượt quá {#limit} ký tự",
  }),
  product_code: Joi.string().max(55).messages({
    "string.max": "Trường mã sản phẩm không được vượt quá {#limit} ký tự",
  }),
  sold_quantity: Joi.number(),
  product_image: Joi.object(),
  thumbnail: Joi.array(),
  product_description_short: Joi.string().max(255).messages({
    "string.max": "Mô tả ngắn sản phẩm không được vượt quá {#limit} ký tự",
  }),
  product_description_long: Joi.string().max(5000).messages({
    "string.max": "Mô tả ngắn sản phẩm không được vượt quá {#limit} ký tự",
  }),
  group_id: Joi.string(),
  product_view: Joi.number(),
  favorite_id: Joi.string(),
  category_id: Joi.string(),
  variant_products: Joi.array(),
  brand_id: Joi.string(),
  slug: Joi.string(),
  average_score: Joi.number(),
  review_count: Joi.number(),
  product_view: Joi.number(),
  product_status: Joi.boolean(),
  favorite_count: Joi.number(),
  product_is_new: Joi.boolean(),
  deleted: Joi.boolean(),
  slug: Joi.string(),
  createdAt: Joi.date(),
  deletedAt: Joi.date(),
  updatedAt: Joi.date(),
});
