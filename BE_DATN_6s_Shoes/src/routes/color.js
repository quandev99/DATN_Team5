import express from "express";
import {
  createColor,
  getColorById,
  getColorBySlug,
  deleteColorById,
  deleteColorBySlug,
  getAllColor,
  searchColor,
  updateColor,
} from "../controller/color.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorization.js";

const Router = express.Router();

Router.post("/colors", createColor);
Router.get("/colors/:id", getColorById);
Router.get("/colors/slug/:slug", getColorBySlug);
Router.delete(
  "/colors/:id",
  authenticate,
  authorize(["Admin", "Member"]),
  deleteColorById
);
Router.delete(
  "/colors/slug/:slug",
  authenticate,
  authorize(["Admin", "Member"]),
  deleteColorBySlug
);
Router.get("/colors/", getAllColor);
Router.put(
  "/colors/:id",
  authenticate,
  authorize(["Admin", "Member"]),
  updateColor
);
Router.get("/colors", searchColor);
export default Router;
