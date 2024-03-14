import Banner from "../../model/banner.js";

export const getAllBanner = async (req, res) => {
  const {
    _page = 1,
    _limit = 10,
    _sort = "display_order",
    _order = "asc",
  } = req.query;
  const options = {
    page: _page || 1,
    limit: _limit || 10,
    sort: { [_sort]: _order === "asc" ? 1 : -1 },
  };
  try {
    const banners = await Banner.paginate({}, options);
    if (!banners || banners?.docs?.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy danh sách banner",
      });
    }
    return res.status(200).json({
      message: "Lấy danh sách banner thành công",
      banners: banners.docs,
      pagination: {
        currentPage: banners.page,
        totalPages: banners.totalPages,
        totalItems: banners.totalDocs,
        limit: banners.limit,
      },
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getBannerById = async (req, res) => {
  const id = req.params.id;
  try {
    const banner = await Banner.findById(id);
    if (!banner || banner.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy banner!",
      });
    }
    return res.status(200).json({
      message: ` Lấy dữ liệu banner theo id : ${id} thành công !`,
      banner,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "error server :((",
    });
  }
};
