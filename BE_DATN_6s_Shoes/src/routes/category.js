import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  getCategoryBySlug,
} from "../controller/category/index.js";
import { authorize } from "../middleware/authorization.js";
import { authenticate } from "../middleware/authenticate.js";
import { deleteAllProductCategory } from "../controller/category/delete.js";

const Router = express.Router();

Router.post("/categories", createCategory);

Router.put(
  "/categories/:id",
  authenticate,
  authorize(["Admin", "Member"]),
  updateCategory
);

Router.get("/categories/:id", getCategoryById);
Router.get("/categories/deleteAllProduct/:id", deleteAllProductCategory);
Router.get("/categories/slug/:slug", getCategoryBySlug);
Router.get("/categories", getAllCategory);
Router.delete("/categories/:id", deleteCategory);

export default Router;
