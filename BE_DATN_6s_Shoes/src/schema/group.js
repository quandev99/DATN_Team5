import Joi from "joi";

export const GroupSchema = Joi.object({
  _id: Joi.string(),
  group_name: Joi.string().required().messages({
    "string.empty": "Tên mã giảm giá bắt buộc nhập",
    "any.required": "Trường tên mã giảm giá bắt buộc nhập",
  }),
  group_description: Joi.string(),
  start_date: Joi.date(),
  end_date: Joi.date(),
  status: Joi.boolean(),
  key: Joi.number(),
  order_sort: Joi.number(),
  products: Joi.array(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});
