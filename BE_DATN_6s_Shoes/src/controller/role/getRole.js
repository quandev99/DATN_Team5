import _ from "lodash";
import Role from "../../model/role.js";
export const getRoleById = async (req, res) => {
  const id = req.params.id;
  try {
    const role = await Role.findById(id);
    if (!role || role.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy phân vai trò !",
      });
    }
    return res.status(200).json({
      message: ` Lấy dữ liệu vai trò theo id : ${id} thành công !`,
      role,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "error server :((",
    });
  }
};

export const getRoleBySlug = async (req, res) => {
  const slug = req.params.slug;
  try {
    const role = await Role.findOne({ slug });
    if (!role || role.length === 0) {
      return res.status(400).json({
        message: `Không tìm được dữ liệu vai trò slug :${slug}`,
      });
    }
    return res.status(200).json({
      message: `Lấy dự liệu thành công bởi slug: ${slug} `,
      role,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "error server :((",
    });
  }
};

export const getAllRole = async (req, res) => {
  const {
    _page = 1,
    _limit = 10,
    _sort = "createdAt",
    _order = "asc",
  } = req.query;
  const options = {
    page: _page || 1,
    limit: _limit || 10,
    sort: { [_sort]: _order === "asc" ? -1 : 1 },
  };
  try {
    const roles = await Role.paginate({}, options);
    if (!roles || roles?.docs?.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy danh sách vai trò",
      });
    }
    return res.status(200).json({
      message: "Lấy danh sách vai trò thành công",
      role: roles.docs,
      pagination: {
        currentPage: roles.page,
        totalPages: roles.totalPages,
        totalItems: roles.totalDocs,
        limit: roles.limit,
      },
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
