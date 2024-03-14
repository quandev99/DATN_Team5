import express from "express";
import {
  createProduct,
  deleteForce,
  deleteProduct,
  getAllDeleted,
  getAllProduct,
  getProductByIdAndCount,
  getProductBySlugAndCount,
  restoreProduct,
  updateProduct,
  getProductByCategory,
  getProductByBrand,
} from "../controller/product/index.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorization.js";
import { getAllProductClient } from "../controller/product/get.js";
import { getProductSale } from "../controller/product/getProductSale.js";
import { getProductFeature } from "../controller/product/getProductFeature.js";
import { patchProduct } from "../controller/product/update.js";
import { getProductNew } from "../controller/product/getProductNew.js";
import { getProductTopSale } from "../controller/product/getProductBestSale.js";

const Router = express.Router();

Router.get("/products", getAllProduct);
Router.get(
  "/product/getAllDeleted",
  authenticate,
  authorize(["Admin", "Member"]),
  getAllDeleted
);

Router.get("/products/:id", getProductByIdAndCount);
Router.get("/products/slug/:slug", getProductBySlugAndCount);
Router.get("/products/categoryID/:id", getProductByCategory);
Router.get("/products/brandID/:id", getProductByBrand);

Router.delete("/products/:id", deleteProduct);
Router.delete("/products/force/:id", deleteForce);

Router.patch(
  "/products/restore/:id",
  authenticate,
  authorize(["Admin", "Member"]),
  restoreProduct
);
Router.post("/products", createProduct);
Router.put(
  "/products/:id",
  authenticate,
  authorize(["Admin", "Member"]),
  updateProduct
);
Router.patch("/products/patch/:id", patchProduct);

Router.post(
  "/products",
  authenticate,
  authorize(["Admin", "Member"]),
  createProduct
);

Router.get("/get-product-sale", getProductSale);
Router.get("/get-all-product-client", getAllProductClient);
Router.get("/get-product-feature", getProductFeature);
Router.get("/get-product-new", getProductNew);
Router.get("/get-product-best-sale", getProductTopSale);

export default Router;
