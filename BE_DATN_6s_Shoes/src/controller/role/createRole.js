import Role from "../../model/role.js";
import { RoleAddSchema } from "./../../schema/role.js";

export const createRole = async (req, res) => {
  const { role_name } = req.body;
  const formData = req.body;
  try {
    const checkName = await Role.findOne({ role_name });
    if (checkName) {
      return res.status(400).json({
        message: "Phân quyền đã tồn tại",
      });
    }

    const { error } = RoleAddSchema.validate(formData);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const role = await Role.create(formData);
    if (!role || role.length === 0) {
      return res.status(400).json({
        message: "Thêm vai trò thất bại",
      });
    }

    return res.status(200).json({
      message: "Thêm vai trò thành công",
      role,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};
