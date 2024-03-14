import express from "express";
import {
  createPaymentStatus,
  getAllPaymentStatus,
  getOnePaymentStatusById,
  removePaymentStatus,
  updatePaymentStatus,
} from "../controller/payment_status.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorization.js";

const Router = express.Router();

Router.post("/pStatus", createPaymentStatus);
Router.get("/pStatus/:id", getOnePaymentStatusById);
Router.get("/pStatus", getAllPaymentStatus);
Router.delete(
  "/pStatus/:id",
  authenticate,
  authorize(["Admin", "Member"]),
  removePaymentStatus
);
Router.put(
  "/pStatus/:id",
  authenticate,
  authorize(["Admin", "Member"]),
  updatePaymentStatus
);
export default Router;
