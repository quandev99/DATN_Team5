import Joi from "joi";

export const RoleAddSchema = Joi.object({
  role_name: Joi.string().max(55).required().messages({
    "string.empty": "Tên phân quyền không được để trống",
    "any.required": "Trường tên phân quyền là bắt buộc",
  }),
  role_description: Joi.string().max(255).messages({
    "string.max": "Mô tả phân quyền không được vượt quá {#limit} ký tự",
  }),
});

export const RoleUpdateSchema = Joi.object({
  _id: Joi.string(),
  role_name: Joi.string().max(55).required().messages({
    "string.empty": "Tên phân quyền không được để trống",
    "any.required": "Trường tên phân quyền là bắt buộc",
  }),
  role_status: Joi.boolean(),
  role_default: Joi.boolean(),
  role_is_new: Joi.boolean(),
  role_description: Joi.string().max(255).messages({
    "string.max": "Mô tả phân quyền không được vượt quá {#limit} ký tự",
  }),
  users: Joi.array(),
  slug: Joi.string(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});
