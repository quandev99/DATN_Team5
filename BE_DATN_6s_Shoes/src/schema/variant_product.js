import Joi from "joi";

export const updateVariantSchema = Joi.object({
  _id: Joi.string(),
  product_id: Joi.string().required(),
  color_id: Joi.string().required(),
  size_id: Joi.string().required(),
  favorite_count: Joi.number(),
  variant_price: Joi.number().min(0).required().messages({
    "number.min": "Giá không được nhỏ hơn 0",
    "number.empty": "Giá không được để trống",
    "any.required": "Trường giá là bắt buộc",
  }),
  variant_stock: Joi.number().min(0).max(2000).required().messages({
    "number.min": "Kho phải lớn hơn hoặc bằng 0",
    "number.max": "Kho không được vượt quá 1000",
    "number.empty": "Kho không được để trống",
    "any.required": "Trường kho là bắt buộc",
  }),
  variant_discount: Joi.number(),
  variant_quantity: Joi.number().min(0).max(1000).required().messages({
    "number.min": "Số lượng phải lớn hơn hoặc bằng 0",
    "number.max": "Số lượng không được vượt quá 1000",
    "number.empty": "Số lượng không được để trống",
    "any.required": "Trường số lượng là bắt buộc",
  }),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});

export const AddVariantProductSchema = Joi.object({
  product_id: Joi.string().required().messages({
    "string.empty": "Sản phẩm bắt buộc nhập",
    "any.required": "Trường Sản phẩm bắt buộc nhập",
    "string.base": "Sản phẩm sản phẩm phải là chuỗi",
  }),
  size_id: Joi.string().required().messages({
    "string.empty": "Kích thước bắt buộc nhập",
    "any.required": "Trường kích thước bắt buộc nhập",
    "string.base": "Kích thước sản phẩm phải là chuỗi",
  }),
  color_id: Joi.string().required().messages({
    "string.empty": "Màu sắc bắt buộc nhập",
    "any.required": "Trường màu sắc bắt buộc nhập",
    "string.base": "Màu sắc sản phẩm phải là chuỗi",
  }),
  variant_price: Joi.number().min(0).required().messages({
    "number.min": "Giá không được nhỏ hơn 0",
    "number.empty": "Giá không được để trống",
    "any.required": "Trường giá là bắt buộc",
  }),
  variant_discount: Joi.number(),
  variant_quantity: Joi.number().min(0).max(1000).required().messages({
    "number.min": "Số lượng phải lớn hơn hoặc bằng 0",
    "number.max": "Số lượng không được vượt quá 1000",
    "number.empty": "Số lượng không được để trống",
    "any.required": "Trường số lượng là bắt buộc",
  }),
  variant_stock: Joi.number().min(0).max(2000).required().messages({
    "number.min": "Kho phải lớn hơn hoặc bằng 0",
    "number.max": "Kho không được vượt quá 1000",
    "number.empty": "Kho không được để trống",
    "any.required": "Trường kho là bắt buộc",
  }),
});
