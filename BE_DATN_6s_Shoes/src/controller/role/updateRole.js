import _ from "lodash";
import Role from "../../model/role.js";
import { RoleUpdateSchema } from "./../../schema/role.js";
import slugify from "slugify";

export const updateRole = async (req, res) => {
  const { role_name } = req.body;
  const { createdAt, updatedAt, ...rest } = req.body;
  const formData = req.body;
  const id = req.params.id;

  try {
    const idRole = await Role.findById(req.params.id);
    if (!idRole || idRole.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy thông tin vai trò",
      });
    }

    const checkIsChange = await Role.findOne({ ...rest });
    if (checkIsChange) {
      return res.status(400).json({
        message: "Vai trò k có thay đổi",
      });
    }

    const productWithSameName = await Role.findOne({ role_name });
    if (productWithSameName && productWithSameName._id.toString() !== id) {
      return res.status(400).json({
        message: "Tên quyền đã tồn tại trong cơ sở dữ liệu",
      });
    }

    const { error } = RoleUpdateSchema.validate(formData, {
      abortEarly: false,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        message: errorMessages,
      });
    }

    // Slug
    const slug = slugify(req.body.role_name, { lower: true });

    let uniqueSlug = await createUniqueSlug(slug);

    const dataRole = _.merge(formData, { slug: uniqueSlug });

    const role = await Role.findByIdAndUpdate(id, dataRole, {
      new: true,
    });

    if (!role || role.length === 0) {
      return res.status(400).json({
        message: "Cập nhật vai trò thất bại",
      });
    }

    return res
      .status(200)
      .json({ message: "Sửa vai trò thành công", role, success: true });
  } catch (error) {
    return res.status(200).json({
      message: error.message || "Lỗi server",
    });
  }
};

async function createUniqueSlug(slug) {
  let uniqueSlug = slug;
  let counter = 1;
  while (true) {
    const existingRole = await Role.findOne({ slug: uniqueSlug });
    if (!existingRole) {
      break;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
