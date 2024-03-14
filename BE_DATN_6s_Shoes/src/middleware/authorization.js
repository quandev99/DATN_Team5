import Role from "../model/role.js";
import { authenticate } from "./authenticate.js";
import User from "../model/user.js";

export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    authenticate(req, res, async () => {
      const user = await User.findById(req.user._id);
      const userRoleId = user.role_id;
      const userRole = await Role.findById(userRoleId);
      if (!userRole || !allowedRoles.includes(userRole.role_name)) {
        return res.status(403).json({
          message: "Bạn không có quyền truy cập.",
        });
      }
      next();
    });
  };
};

export const authorization = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.user_role !== "Admin") {
      return res.status(400).json({
        message: "Bạn không có quyền để thực hiện hành động này",
      });
    }
    next();
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
