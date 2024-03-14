import Joi from "joi";

export const reviewCreateSchema = Joi.object({
  user_id: Joi.string().required(),
  product_id: Joi.string().required(),
  bill_id: Joi.string().required(),
  review_rating: Joi.number().required().min(1).max(5).message({
    "any.required": "Vui lòng đánh giá",
  }),
  review_content: Joi.string().max(500),
  review_image: Joi.array(),
  user_fullname: Joi.string().max(55),
  user_avatar: Joi.object(),
});
