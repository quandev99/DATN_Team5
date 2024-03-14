import express from "express";
import connectDB from "./config/database.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";

import RoleRouter from "./routes/role.js";
import UserRouter from "./routes/user.js";
import AuthRouter from "./routes/auth.js";
import BrandRouter from "./routes/brand.js";
import uploadRouter from "./routes/upload.js";
import CategoryRouter from "./routes/category.js";
import ProductFavoriteRouter from "./routes/product_favorite.js";
import ProductRouter from "./routes/product.js";
import VariantProductRouter from "./routes/variant_product.js";
import ColorRouter from "./routes/color.js";
import SizeRouter from "./routes/size.js";
import CouponRouter from "./routes/coupon.js";
import CartRouter from "./routes/cart.js";
import PaymentStatusRouter from "./routes/payment_status.js";
import PaymentMehodRouter from "./routes/paymentMethod.js";
import BillRouter from "./routes/bill.js";
import NewsRouter from "./routes/news.js";
import ReviewRouter from "./routes/review.js";
import PaymentRouter from "./routes/payment.js";
import BannerRouter from "./routes/banner.js";
import StatisticRouter from "./routes/statistic.js";
import GroupRouter from "./routes/product_group.js";
import ContactRouter from "./routes/contact.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api", RoleRouter);
app.use("/api", UserRouter);
app.use("/api", AuthRouter);
app.use("/api", BrandRouter);
app.use("/api", uploadRouter);
app.use("/api", CategoryRouter);
app.use("/api", ProductFavoriteRouter);
app.use("/api", ProductRouter);
app.use("/api", VariantProductRouter);
app.use("/api", ColorRouter);
app.use("/api", SizeRouter);
app.use("/api", CouponRouter);
app.use("/api", CartRouter);
app.use("/api", PaymentStatusRouter);
app.use("/api", PaymentMehodRouter);
app.use("/api", BillRouter);
app.use("/api", NewsRouter);
app.use("/api", ReviewRouter);
app.use("/api", PaymentRouter);
app.use("/api", BannerRouter);
app.use("/api", StatisticRouter);
app.use("/api", GroupRouter);
app.use("/api", ContactRouter);

connectDB(process.env.MONGO_URL);

app.listen(process.env.PORT, async () => {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Server is running http://localhost:8080/api");
});

export const viteNodeApp = app;
