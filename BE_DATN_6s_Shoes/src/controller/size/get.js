import Size from "../../model/size.js";

export const getAllSizes = async (req, res) => {
  const {
    _page = 1,
    _sort = "createdAt",
    _limit = 100,
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
      ? { size_name: { $regex: _search, $options: "i" } }
      : {};
    const sizes = await Size.paginate(searchQuery, options);
    if (!sizes || sizes.docs.length === 0)
      return res.status(400).json({
        message: "No brand found!(Không tìm thấy sizes ! )",
      });
    return res.status(200).json({
      sizes: sizes.docs,
      paginattion: {
        currentPage: sizes.page,
        totalPages: sizes.totalPages,
        totalItems: sizes.totalDocs,
        limit: sizes.limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error Server ",
    });
  }
};

export const getSizeById = async (req, res) => {
  const { id } = req.params;
  try {
    const size = await Size.findById(id);
    if (!size) {
      return res.status(400).json({
        message: `Không tìm thấy size có ID ${id}`,
      });
    }
    return res.status(200).json({
      message: `Dữ liệu size có ID ${id}`,
      size,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};
export const getSizeBySlug = async (req, res) => {
  const slug = req.params.slug;
  try {
    const size = await Size.findOne({ slug: slug });
    if (!size) {
      return res.status(400).json({
        message: `Không tìm thấy size có slug là :  ${slug}`,
      });
    }
    return res.status(200).json({
      message: `Lấy size thành công  có slug là : ${slug}`,
      size,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};
