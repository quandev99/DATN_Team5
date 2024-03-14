import express from "express";
import {
  register,
  signin,
  forgetPassword,
  verifyToken,
  requestRefreshToken,
  test_token_get_user,
  changePasswordNew,
  changePasswordForget,
} from "../controller/auth/index.js";
import { resetToken } from "../controller/auth/resetToken.js";
import { verifyUser } from "../controller/auth/verifyToken.js";

const Router = express.Router();

Router.post("/auth/signin", signin);
Router.post("/auth/signup", register);
Router.post("/auth/verify", verifyUser);

Router.post("/auth/change-password-new", changePasswordNew);
Router.post("/auth/change-password-forget", changePasswordForget);
Router.post("/auth/forget-password", forgetPassword);
Router.post("/auth/verify-email", verifyToken);
Router.post("/auth/reset-token", resetToken);

Router.post("/auth/resfeshtoken", requestRefreshToken);
Router.get("/auth/users/:id", test_token_get_user);
export default Router;
