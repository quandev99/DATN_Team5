import Brand from "../../model/brand.js";

export const getAllBrand = async (req, res) => {
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
      ? { brand_name: { $regex: _search, $options: "i" } }
      : {};

    const brands = await Brand.paginate(searchQuery, options);
    if (!brands || brands.docs.length === 0)
      return res.status(400).json({
        message: "No brand found!(Không tìm thấy thương hiệu nào! )",
      });
    return res.status(200).json({
      brands: brands.docs,
      paginattion: {
        currentPage: brands.page,
        totalPages: brands.totalPages,
        totalItems: brands.totalDocs,
        limit: brands.limit,
      },
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getBrandById = async (req, res) => {
  const id = req.params.id;
  try {
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(400).json({
        message: "Không tìm thấy thương hiệu",
      });
    }
    return res.status(200).json({
      message: `Lấy dữ liệu thương hiệu theo id ${id} thành công!`,
      brand,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

export const getBrandBySlug = async (req, res) => {
  const slug = req.params.slug;
  try {
    const brand = await Brand.findOne({ slug });
    if (!brand) {
      return res.status(400).json({
        message: `Không tìm thấy dữ liệu thương hiệu với slug ${slug}`,
      });
    }
    return res.status(200).json({
      message: `Lấy dữ liệu thương hiệu thành công theo slug ${slug}`,
      brand,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};
