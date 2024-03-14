import ProductGroup from "../../model/group.js";
import cron from "node-cron";

export const getProductGroup = async (req, res) => {
  const {
    _page = 1,
    _limit = 100,
    _sort = "order_sort",
    _order = "asc",
  } = req.query;

  const options = {
    page: _page,
    limit: _limit,
    sort: { [_sort]: _order === "asc" ? 1 : -1 },
  };

  try {
    const groups = await ProductGroup.paginate({ status: false }, options);
    await ProductGroup.populate(groups.docs, [
      {
        path: "products",
        match: { product_status: false },
        populate: {
          path: "variant_products",
        },
      },
    ]);
    if (!groups || groups?.docs?.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy danh sách vai trò",
      });
    }

    return res.status(200).json({
      message: "Lấy thành công danh sách nhóm sản phẩm",
      groups: groups.docs,
      pagination: {
        currentPage: groups.page,
        totalPages: groups.totalPages,
        totalItems: groups.totalDocs,
        limit: groups.limit,
      },
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi máy chủ: " + error.message,
    });
  }
};

export const getAllProductGroup = async (req, res) => {
  const {
    _page = 1,
    _limit = 100,
    _sort = "order_sort",
    _order = "asc",
  } = req.query;
  const options = {
    page: _page,
    limit: _limit,
    sort: { [_sort]: _order === "asc" ? 1 : -1 },
  };
  try {
    const currentTime = new Date();
    const groups = await ProductGroup.paginate({}, options);

    await ProductGroup.populate(groups.docs, [
      {
        path: "products",
        match: { product_status: false },
        populate: {
          path: "variant_products",
        },
      },
    ]);
    if (!groups || groups?.docs?.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy danh sách vai trò",
      });
    }

    for (const group of groups.docs) {
      if (group.start_date <= currentTime && group.end_date > currentTime) {
        group.status = false;
      } else {
        group.status = true;
      }

      await group.save();
    }

    return res.status(200).json({
      message: "Lấy thành công danh sách nhóm sản phẩm",
      groups: groups.docs,
      pagination: {
        currentPage: groups.page,
        totalPages: groups.totalPages,
        totalItems: groups.totalDocs,
        limit: groups.limit,
      },
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi máy chủ: " + error.message,
    });
  }
};
