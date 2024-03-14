import express from "express";
import {
  createSize,
  deleteSizeById,
  deleteSizeBySlug,
  getAllSizes,
  getSizeById,
  getSizeBySlug,
  updateSize,
} from "../controller/size/index.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorization.js";

const Router = express.Router();

Router.post("/sizes", createSize);
Router.delete(
  "/sizes/:id",
  authenticate,
  authorize(["Admin", "Member"]),
  deleteSizeById
);
Router.delete(
  "/sizes/slug/:slug",
  authenticate,
  authorize(["Admin", "Member"]),
  deleteSizeBySlug
);
Router.get("/sizes", getAllSizes);
Router.get("/sizes/:id", getSizeById);
Router.put(
  "/sizes/:id",
  authenticate,
  authorize(["Admin", "Member"]),
  updateSize
);
Router.get("/sizes/slug/:slug", getSizeBySlug);

export default Router;
