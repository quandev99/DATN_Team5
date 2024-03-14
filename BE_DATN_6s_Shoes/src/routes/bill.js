import express from "express";
import {
  createBill,
  getAllBill,
  getBillByUser,
  getBillById,
  deleteBillById,
  updateBill,
  getBillStatus,
  getBillByUserReviews,
} from "../controller/bill/index.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorization.js";
import { getBillStatusByUser } from "../controller/bill/getBillbyStatus.js";



const Router = express.Router();

Router.post("/checkout", createBill);
Router.put("/bills/update/:bill_id", updateBill);

Router.get("/bills", getAllBill);
Router.get("/bills/dStatus/:statusId", getBillStatus);
Router.get("/bills/user/:userId", getBillByUser);
Router.get(
  "/bills/user/:user_id/status/:payment_status_id",
  getBillStatusByUser
);
Router.get("/bills/:billId", getBillById);
Router.get("/bills/user/:userId/reviews", getBillByUserReviews);
Router.delete("/bills/delete/:id", deleteBillById);

export default Router;
