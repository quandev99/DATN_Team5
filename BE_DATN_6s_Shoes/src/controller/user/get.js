import User from "../../model/user.js";
import _ from "lodash";

export const getAllUsers = async (req, res, next) => {
  const {
    _page = 1,
    _limit = 10,
    _sort = "createdAt",
    _order = "asc",
    _search = "",
    _username = "",
    _email = "",
    _gender = "",
    _address = "",
  } = req.query;

  const options = {
    page: _page || 1,
    limit: _limit || 10,
    sort: { [_sort]: _order === "asc" ? -1 : 1 },
  };

  try {
    const searchQuery = {};
    if (_search || _username) {
      searchQuery.$and = [];

      if (_search) {
        searchQuery.$and.push({
          user_fullname: { $regex: _search, $options: "i" },
        });
      }

      if (_username) {
        searchQuery.$and.push({
          user_username: { $regex: _username, $options: "i" },
        });
      }
      if (_gender) {
        searchQuery.$and.push({
          user_gender: { $regex: _gender, $options: "i" },
        });
      }
      if (_email) {
        searchQuery.$and.push({
          user_email: { $regex: _email, $options: "i" },
        });
      }
      if (_address) {
        searchQuery.$and.push({
          user_address: { $regex: _address, $options: "i" },
        });
      }
    }

    const users = await User.paginate(searchQuery, options);
    if (!users || users.docs.length === 0)
      return res
        .status(401)
        .json({ message: "Không tìm thấy danh sách tài khoản người dùng!" });
    return res.status(200).json({
      message: "Danh sách tài khoản người dùng!",
      users: users.docs,
      pagination: {
        currentPage: users.page,
        totalPages: users.totalPages,
        totalItems: users.totalDocs,
        limit: users.limit,
      },
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error server: " + error.message });
  }
};

export const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user || user.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy thông tin tài khoản !",
      });
    }
    return res.status(200).json({
      message: ` Lấy dữ liệu tài khoản theo id : ${id} thành công !`,
      user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

export const getUserBySlug = async (req, res) => {
  const slug = req.params.slug;
  try {
    const user = await User.findOne({ slug });
    if (!user || user.length === 0) {
      return res.status(400).json({
        message: `Không tìm được dữ liệu tài khoản slug :${slug}`,
      });
    }
    return res.status(200).json({
      message: `Lấy dự liệu tài khoản thành công bởi slug: ${slug} `,
      user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

export const getUserProfileByToken = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ accessToken: token });
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy thông tin người dùng",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lấy thông tin người dùng thành công",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.messag || "Lỗi server",
    });
  }
};
