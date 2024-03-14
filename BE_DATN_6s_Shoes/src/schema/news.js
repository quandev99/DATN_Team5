import Joi from "joi";

export const NewsSchema = Joi.object({
  _id: Joi.string(),
  news_title: Joi.string(),
  news_content: Joi.string().min(1).max(5000).required().messages({
    "string.empty": "Nội dung không được để trống",
    "string.min": "Tối thiểu là 1 ký tự",
    "string.max": "Tối đa là 5000 ký tự"
  }),
  news_image: Joi.object(),
  user_id: Joi.string().required().messages({
    "any.required": "Cần chọn người viết bài",
  }),
  product_id: Joi.string().required().messages({
    "any.required": "Cần chọn sản phẩm cho bài viết",
  }),
  status: Joi.boolean(),
  news_view: Joi.number(),
  createdAt: Joi.date(),
  deletedAt: Joi.date(),
  updatedAt: Joi.date(),
});