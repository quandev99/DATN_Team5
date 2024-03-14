import express from "express";
import {
  addProductGroup,
  deleteGroup,
  getAllProductGroup,
  getProductGroup,
  updateProductGroup,
} from "../controller/product_group/index.js";
import { getGroupById } from "../controller/product_group/getOne.js";
import { deleteProductFromGroup } from "../controller/product_group/deleteProductByGroup.js";
const Router = express.Router();

Router.get("/product-groups/all", getAllProductGroup);
Router.get("/product-groups", getProductGroup);
Router.get("/product-groups/:id", getGroupById);
Router.delete("/product-groups/delete/:id", deleteGroup);
Router.post("/product-groups", addProductGroup);
Router.put("/product-groups/:id", updateProductGroup);
Router.post("/product-groups/delete-product", deleteProductFromGroup);

export default Router;
