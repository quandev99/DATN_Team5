import express from "express";
import {
  createVariantProduct,
  deleteVariantProduct,
  getAllVariantProduct,
  updateVariantProduct,
  getVariantProductById,
  getVariantProductID,
} from "../controller/variant_product.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorization.js";

const Router = express.Router();

Router.post(
  "/variant-product",

  createVariantProduct
);
Router.get("/variant-product", getAllVariantProduct);
Router.delete(
  "/variant-product/:id",
  authenticate,
  authorize(["Admin", "Member"]),
  deleteVariantProduct
);
Router.put("/variant-product/:id/update", updateVariantProduct);
Router.get("/variant-product/variant/:id", getVariantProductID);
Router.get("/variant-product/:id", getVariantProductById);
export default Router;
