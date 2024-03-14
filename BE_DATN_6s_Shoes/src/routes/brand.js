import express from "express";
import {
  createBrand,
  deleteBrand,
  getAllBrand,
  getBrandById,
  getBrandBySlug,
  updateBrand,
} from "../controller/brand/index.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorization.js";
import { deleteAllProductBrand } from "../controller/brand/delete.js";
const Router = express.Router();

Router.get("/brands", getAllBrand);
Router.delete(
  "/brands/:id",
  authenticate,
  authorize(["Admin", "Member"]),
  deleteBrand
);

Router.delete(
  "/brands/deleteAllProduct/:id",
  authenticate,
  authorize(["Admin", "Member"]),
  deleteAllProductBrand
);
Router.put(
  "/brands/:id",
  authenticate,
  authorize(["Admin", "Member"]),
  updateBrand
);
Router.post(
  "/brands",
  authenticate,
  authorize(["Admin", "Member"]),
  createBrand
);
Router.get("/brands/:id", getBrandById);
Router.get("/brands/slug/:slug", getBrandBySlug);
export default Router;
