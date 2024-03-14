import express from "express";
import {
  banUser,
  createUserProfile,
  deleteUser,
  getAllUsers,
  getUserById,
  getUserBySlug,
  updateUserProfile,
} from "../controller/user/index.js";
import { getUserProfileByToken } from "../controller/user/index.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorization.js";

const Router = express.Router();

Router.post(
  "/users",
  authenticate,
  authorize(["Admin", "Member"]),
  createUserProfile
);

Router.get("/users", getAllUsers);
Router.get("/users/profile/token/:token", getUserProfileByToken);
Router.get(
  "/users/:id",
  authenticate,
  authorize(["Admin", "Member", "Customer"]),
  getUserById
);

Router.get(
  "/user/:slug",
  authenticate,
  authorize(["Admin", "Member", "Customer"]),
  getUserBySlug
);

Router.put(
  "/users/ban/:id",
  authenticate,
  authorize(["Admin", "Member", "Customer"]),
  banUser
);

Router.delete(
  "/users/:id",
  authenticate,
  authorize(["Admin", "Member", "Customer"]),
  deleteUser
);

Router.put(
  "/users/:id",
  authenticate,
  authorize(["Admin", "Member", "Customer"]),
  updateUserProfile
);

export default Router;
