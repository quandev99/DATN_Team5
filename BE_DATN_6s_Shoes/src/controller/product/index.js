import {
  getAllProduct,
  getProductBySlugAndCount,
  getProductByIdAndCount,
} from "./get.js";
import { createProduct } from "./create.js";
import { updateProduct } from "./update.js";

import {
  getAllDeleted,
  deleteForce,
  deleteProduct,
  restoreProduct,
} from "./soft-delete.js";
import { getProductByCategory } from "./getByCategory.js";
import { getProductByBrand } from "./getByBrand.js";
export {
  getAllProduct,
  getProductBySlugAndCount,
  createProduct,
  updateProduct,
  getAllDeleted,
  deleteProduct,
  deleteForce,
  restoreProduct,
  getProductByBrand,
  getProductByCategory,
  getProductByIdAndCount,
};
