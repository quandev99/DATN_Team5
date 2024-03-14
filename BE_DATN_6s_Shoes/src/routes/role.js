import express from "express";
import {
  createRole,
  getAllRole,
  getRoleById,
  getRoleBySlug,
  removeRole,
  updateRole,
} from "../controller/role/index.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorization.js";

const Router = express.Router();

Router.post("/roles", authenticate, authorize(["Admin", "Member"]), createRole);
Router.get("/roles", getAllRole);
Router.get("/roles/:id", getRoleById);
Router.get("/roles/slug/:slug", getRoleBySlug);
Router.delete(
  "/roles/:id",
  authenticate,
  authorize(["Admin", "Member"]),
  removeRole
);
Router.put(
  "/roles/:id",
  authenticate,
  authorize(["Admin", "Member"]),
  updateRole
);
export default Router;
