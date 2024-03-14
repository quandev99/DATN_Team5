import express from "express";
import {
  createPaymentMethod,
  getAllPaymentMethod,
  getPaymentMethodByID,
  removePaymentMethod,
  updatePaymentMethod,
} from "../controller/paymentMethod.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorization.js";
const Router = express.Router();

Router.post(
  "/payment-methods",
  authenticate,
  authorize(["Admin", "Member"]),
  createPaymentMethod
);
Router.get("/payment-methods", getAllPaymentMethod);
Router.get("/payment-methods/:id", getPaymentMethodByID);
Router.delete(
  "/payment-methods/:id",
  authenticate,
  authorize(["Admin", "Member"]),
  removePaymentMethod
);
Router.put(
  "/payment-methods/:id",
  authenticate,
  authorize(["Admin", "Member"]),
  updatePaymentMethod
);
export default Router;
