import _ from "lodash";
import Role from "../../model/role.js";
import { RoleAddSchema } from "./../../schema/role.js";

export const removeRole = async (req, res) => {
  const { id } = req.params;
  try {
    const role = await Role.findOne({ _id: id });
    if (!role) {
      return res.status(400).json({
        message: "Không tìm thấy quyền",
      });
    }

    const deleteRole = await Role.findByIdAndDelete(id);
    if (!deleteRole) {
      return res.status(400).json({
        message: "Xóa quyền không thành công",
      });
    }

    return res.status(200).json({
      message: "Xóa quyền thành công",
      deleteRole,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
