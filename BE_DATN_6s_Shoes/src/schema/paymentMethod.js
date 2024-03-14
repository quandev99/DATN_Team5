import Joi from 'joi'

export const addSchemaPaymentMethod = Joi.object({
    pMethod_name: Joi.string().required().messages({
      "string.empty": "Tên phương thức thanh toán bắt buộc nhập",
      "any.required": "Trường phương thức thanh toán bắt buộc nhập",
    }),
    pMethod_description: Joi.string().max(30).messages({
      "string.max": "phương thức thanh toán không được vượt quá {#limit} ký tự",
    }),
    pMethod_image: Joi.object(),
    status: Joi.boolean()
  });

  export const updateSchemaPaymentMethod = Joi.object({
    _id: Joi.string(),
    pMethod_name: Joi.string().required().messages({
        "string.empty": "Tên phương thức thanh toán không được để trống",
        "any.required": "Trường phương thức thanh toán bắt buộc nhập",
    }),
    pMethod_description: Joi.string().max(100).messages({
        "string.max": "phương thức thanh toán không được nhiều hơn {#limit} ký tự",
    }),
    pMethod_image: Joi.object(),
    status: Joi.boolean(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
});