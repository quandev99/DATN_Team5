import Category from "../../model/category.js";

export const getAllCategory = async (req, res) => {
  const {
    _page = 1,
    _sort = "createdAt",
    _limit = 10,
    _order = "asc",
    _search = "",
  } = req.query;

  const options = {
    page: _page,
    sort: { [_sort]: _order === "asc" ? -1 : 1 },
    limit: _limit,
  };

  try {
    const searchQuery = _search
      ? { category_name: { $regex: _search, $options: "i" } }
      : {};

    const categories = await Category.paginate(searchQuery, options);
    if (!categories || categories.docs.length === 0)
      return res.status(400).json({
        message: "Không tìm thấy thông tin danh mục nào!",
      });

    return res.status(200).json({
      message: "Lấy danh sách danh mục sản phẩm thành công",
      categories: categories.docs,
      pagination: {
        currentPage: categories.page,
        totalPages: categories.totalPages,
        totalItems: categories.totalDocs,
        limit: categories.limit,
      },
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error Server",
    });
  }
};

export const getCategoryById = async (req, res) => {
  const id = req.params.id;
  try {
    const category = await Category.findById(id);
    if (!category || category.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy danh mục !",
      });
    }
    return res.status(200).json({
      message: ` Lấy dữ liệu danh mục theo id : ${id} thành công !`,
      category,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "error server :((",
    });
  }
};

export const getCategoryBySlug = async (req, res) => {
  const slug = req.params.slug;
  try {
    const category = await Category.findOne({ slug });
    if (!category || category.length === 0) {
      return res.status(400).json({
        message: `Không tìm được dữ liệu danh mục slug :${slug}`,
      });
    }
    return res.status(200).json({
      message: `Lấy dự liệu thành công danh mục bởi slug: ${slug} `,
      category,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "error server :((",
    });
  }
};
