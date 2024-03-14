import joi from "joi";
const vietnamesePhoneNumberRegex = /^(0[2-9])+([0-9]{8})$/;

export const createUserSchema = joi.object({
  user_fullname: joi.string().max(55).required().messages({
    "string.max": "Họ và tên không được vượt quá {#limit} ký tự",
    "string.empty": "Họ và tên không được để trống",
    "any.required": "Trường họ và tên là bắt buộc",
  }),
  user_username: joi.string().max(55).required().messages({
    "string.max": "Tên đăng nhập không được vượt quá {#limit} ký tự",
    "string.empty": "Tên đăng nhập không được để trống",
    "any.required": "Trường Tên đăng nhập là bắt buộc",
  }),
  user_avatar: joi.object(),
  user_email: joi.string().email().required().messages({
    "string.email": "Email không đúng định dạng",
    "string.empty": "Email không được để trống",
    "any.required": "Trường email là bắt buộc",
  }),
  user_password: joi.string().required().min(6).messages({
    "string.min": "Password phải có ít nhất {#limit} ký tự",
    "string.empty": "Password không được để trống",
    "any.required": "Trường Password là bắt buộc",
  }),
  user_confirmPassword: joi
    .string()
    .valid(joi.ref("user_password"))
    .required()
    .messages({
      "any.only": "Password không khớp",
      "any.required": "Trường confirm password là bắt buộc",
    }),
  user_phone: joi
    .string()
    .pattern(vietnamesePhoneNumberRegex, "Vietnamese Phone Number")
    .required(),
  user_address: joi.string(),
  user_gender: joi.string(),
  user_date_of_birth: joi.date(),
  role_id: joi.string(),
});

export const updateUserSchema = joi.object({
  user_fullname: joi.string().max(55).required().messages({
    "string.max": "Họ và tên không được vượt quá {#limit} ký tự",
    "string.empty": "Họ và tên không được để trống",
    "any.required": "Trường họ và tên là bắt buộc",
  }),
  user_username: joi.string().max(55).required().messages({
    "string.max": "Tên đăng nhập không được vượt quá {#limit} ký tự",
    "string.empty": "Tên đăng nhập không được để trống",
    "any.required": "Trường Tên đăng nhập là bắt buộc",
  }),
  user_email: joi.string().email().required().messages({
    "string.email": "Email không đúng định dạng",
    "string.empty": "Email không được để trống",
    "any.required": "Trường email là bắt buộc",
  }),
  user_avatar: joi.object(),
  user_phone: joi.string().pattern(/^[0-9]{10}$/),
  user_address: joi.string(),
  verifyToken: joi.object(),
  isVerified: joi.boolean(),
  user_password: joi.string(),
  user_confirmPassword: joi.string(),
  user_gender: joi.string().valid("Nam", "Nữ", "Khác"),
  user_date_of_birth: joi.date(),
  role_id: joi.string(),
  cart_id: joi.string(),
  user_status: joi.boolean(),
  slug: joi.string(),
  bills: joi.array(),
  favorite_id: joi.string(),
  createdAt: joi.date(),
  updatedAt: joi.date(),
});
