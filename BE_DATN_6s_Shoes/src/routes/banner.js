import express from "express";
import {
  createBanner,
  getAllBanner,
  getBannerById,
  removeBanner,
  updateBanner,
} from "../controller/banner/index.js";

const Router = express.Router();

Router.get("/banners", getAllBanner);
Router.delete("/banners/:id", removeBanner);
Router.put("/banners/:id", updateBanner);
Router.post("/banners", createBanner);
Router.get("/banners/:id", getBannerById);
export default Router;
