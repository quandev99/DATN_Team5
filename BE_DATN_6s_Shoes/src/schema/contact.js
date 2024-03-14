import Joi from "joi";

export const ContactSchema = Joi.object({
    _id: Joi.string(),
    contact_fullName: Joi.string().max(55).required().messages({
      "string.empty": "Họ tên không được để trống",
      "any.required": "Họ tên bắt buộc nhập",
      "string.max": "Họ tên không vượt quá 55 ký tự"
    }),
    contact_phone: Joi.string().required().messages({
        "string.empty": "Số điện thoại không được để trống",
        "any.required": "Số điện thoại là bắt buộc",
        "string.max": "Số điện thoại không đúng",
    }),
    contact_email: Joi.string().email().required().messages({
        "string.empty": "Email không được để trống",
        "any.required": "Email bắt buộc nhập",
      }),
   contact_content: Joi.string().max(5000),
   createdAt: Joi.date(),
   updatedAt: Joi.date()
  });