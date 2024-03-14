import express from "express";
import {
  addToCart,
  deleleAllProductCart,
  deleteProductCart,
  getCartByUser,
  updateCart,
  applyCoupon,
} from "../controller/cart/index.js";

const Router = express.Router();
Router.get("/carts/user/:user_id", getCartByUser);
Router.post("/carts", addToCart);
Router.put("/carts/update", updateCart);

Router.delete("/carts/deleteall/:userId", deleleAllProductCart);
Router.post("/carts/delete", deleteProductCart);

Router.patch("/carts/:id/apply", applyCoupon);

export default Router;
