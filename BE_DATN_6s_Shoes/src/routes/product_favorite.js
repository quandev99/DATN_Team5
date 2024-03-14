import express from "express";
import {
  addProductToFavorite,
  getFavoriteProductsByUserId,
  getTopFavoriteProducts,
} from "../controller/product_favorite.js";
import { authorize } from "../middleware/authorization.js";
import { authenticate } from "../middleware/authenticate.js";

const Router = express.Router();

Router.post(
  "/favorites",
  authenticate,
  authorize(["Admin", "Member", "Customer"]),
  addProductToFavorite
);
Router.get("/favorites", getTopFavoriteProducts);
Router.get(
  "/favorites/:user_id",
  authenticate,
  authorize(["Admin", "Member", "Customer"]),
  getFavoriteProductsByUserId
);
export default Router;
