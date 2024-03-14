import express from "express";
import {
  createNews,
  listNews,
  deleteNews,
  updateNews,
  listNewsByUser,
  listNewsById,
} from "../controller/news.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorization.js";

const Router = express.Router();

Router.post("/news", authenticate, authorize(["Admin", "Member"]), createNews);
Router.put(
  "/news/:id",
  authenticate,
  authorize(["Admin", "Member"]),
  updateNews
);
Router.get("/news", listNews);
Router.get("/news/userId/:id", listNewsByUser);
Router.get("/news/:id", listNewsById);
Router.delete(
  "/news/:newsId",
  authenticate,
  authorize(["Admin", "Member"]),
  deleteNews
);

export default Router;
