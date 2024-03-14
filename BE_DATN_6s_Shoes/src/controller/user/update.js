import User from "../../model/user.js";
import Role from "../../model/role.js";
import slugify from "slugify";
import { updateUserSchema } from "../../schema/user.js";

export const updateUserProfile = async (req, res) => {
  const id = req.params.id;
  const updatedUserData = req.body;
  const { user_email, user_fullname, role_id, user_username } = req.body;
  const { createdAt, updatedAt, ...rest } = req.body;

  try {
    let existingUser = await User.findById(id).lean();
    if (!existingUser) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const { error } = updateUserSchema.validate(updatedUserData, {
      abortEarly: false,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        message: errorMessages,
      });
    }
    if (role_id) {
      const role = await Role.findById(role_id);
      if (!role) {
        return res.status(400).json({
          message: `Quyền có id ${role_id} không hợp lệ`,
        });
      }
    }

    // slug
    if (user_username) {
      const newSlug = slugify(user_username, { lower: true });
      const uniqueSlug = await createUniqueSlug(newSlug, User);
      existingUser.slug = uniqueSlug;
    }

    // email
    const checkIsChange = await User.findOne({ ...rest });
    if (checkIsChange) {
      return res.status(400).json({
        message: "Tài khoản k có thay đổi",
      });
    }

    if (user_username) {
      const usernameExists = await User.findOne({
        user_username: user_username,
      });
      if (usernameExists && usernameExists._id.toString() !== id) {
        return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
      }
      existingUser.user_username = user_username;
    }

    if (user_email) {
      const usernameExists = await User.findOne({
        user_email: user_email,
      });
      if (usernameExists && usernameExists._id.toString() !== id) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      }
      existingUser.user_username = user_username;
    }

    existingUser = { ...existingUser };
    existingUser = { ...existingUser, ...updatedUserData };
    await User.updateOne({ _id: id }, existingUser);

    return res.status(200).json({
      message: "Cập nhật thông tin người dùng thành công",
      user: existingUser,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

async function createUniqueSlug(slug) {
  let uniqueSlug = slug;
  let counter = 1;
  while (true) {
    const existingUser = await User.findOne({ slug: uniqueSlug });
    if (!existingUser) {
      break;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
