import Cart from "../../model/cart.js";
import Coupon from "../../model/coupon.js";

export const getAllCoupons = async (req, res) => {
  const {
    _page = 1,
    _sort = "createdAt",
    _limit = 10,
    _order = "asc",
    _search = "",
    _coupon_code = "",
    _coupon_quantity_lt = "",
    _expiration_date = "",
  } = req.query;
  const options = {
    page: _page,
    sort: { [_sort]: _order === "asc" ? -1 : 1 },
    limit: _limit,
  };

  try {
    const searchQuery = {};

    if (_search || _coupon_code) {
      searchQuery.$and = [];

      if (_search) {
        searchQuery.$and.push({
          coupon_name: { $regex: _search, $options: "i" },
        });
      }

      if (_coupon_code) {
        searchQuery.$and.push({
          coupon_code: { $regex: _coupon_code, $options: "i" },
        });
      }

      if (_coupon_quantity_lt && !isNaN(Number(_coupon_quantity_lt))) {
        searchQuery.$and.push({
          coupon_quantity: { $lt: Number(_coupon_quantity_lt) },
        });
      }

      if (_expiration_date) {
        searchQuery.expiration_date = {
          $lte: new Date(`${_expiration_date}T23:59:59.999Z`),
        };
      }
    }

    const coupon = await Coupon.paginate(searchQuery, options);
    if (!coupon || coupon.docs.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh sách mã giảm giá",
      });
    }
    return res.status(200).json({
      message: "Lấy danh sách phiếu giảm giá thành công",
      coupon: coupon.docs,
      paginattion: {
        currentPage: coupon.page,
        totalPages: coupon.totalPages,
        totalItems: coupon.totalDocs,
        limit: coupon.limit,
      },
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getCouponByUser = async (req, res) => {
  const {
    _page = 1,
    _sort = "createdAt",
    _limit = 10,
    _order = "asc",
    _search = "",
    _coupon_code = "",
    _coupon_quantity_lt = "",
    _expiration_date = "",
  } = req.query;
  const options = {
    page: _page,
    sort: { [_sort]: _order === "asc" ? -1 : 1 },
    limit: _limit,
  };

  const { userId } = req.params;

  try {
    const searchQuery = { status: false, isSpecial: true, users: userId };

    if (_search || _coupon_code) {
      searchQuery.$and = [];

      if (_search) {
        searchQuery.$and.push({
          coupon_name: { $regex: _search, $options: "i" },
        });
      }

      if (_coupon_code) {
        searchQuery.$and.push({
          coupon_code: { $regex: _coupon_code, $options: "i" },
        });
      }

      if (_coupon_quantity_lt && !isNaN(Number(_coupon_quantity_lt))) {
        searchQuery.$and.push({
          coupon_quantity: { $lt: Number(_coupon_quantity_lt) },
        });
      }

      if (_expiration_date) {
        searchQuery.expiration_date = {
          $lte: new Date(`${_expiration_date}T23:59:59.999Z`),
        };
      }
    }

    const coupon = await Coupon.paginate(searchQuery, options);
    if (!coupon || coupon.docs.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh sách mã giảm giá",
      });
    }

    return res.status(200).json({
      message: "Lấy danh sách phiếu giảm giá thành công",
      coupon: coupon.docs,
      paginattion: {
        currentPage: coupon.page,
        totalPages: coupon.totalPages,
        totalItems: coupon.totalDocs,
        limit: coupon.limit,
      },
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getCouponAllUsers = async (req, res) => {
  const {
    _page = 1,
    _sort = "createdAt",
    _limit = 10,
    _order = "asc",
    _search = "",
    _coupon_code = "",
    _coupon_quantity_lt = "",
    _expiration_date = "",
  } = req.query;
  const options = {
    page: _page,
    sort: { [_sort]: _order === "asc" ? -1 : 1 },
    limit: _limit,
  };

  try {
    const searchQuery = { status: false, isSpecial: false };

    if (_search || _coupon_code) {
      searchQuery.$and = [];

      if (_search) {
        searchQuery.$and.push({
          coupon_name: { $regex: _search, $options: "i" },
        });
      }

      if (_coupon_code) {
        searchQuery.$and.push({
          coupon_code: { $regex: _coupon_code, $options: "i" },
        });
      }

      if (_coupon_quantity_lt && !isNaN(Number(_coupon_quantity_lt))) {
        searchQuery.$and.push({
          coupon_quantity: { $lt: Number(_coupon_quantity_lt) },
        });
      }

      if (_expiration_date) {
        searchQuery.expiration_date = {
          $lte: new Date(`${_expiration_date}T23:59:59.999Z`),
        };
      }
    }

    const coupon = await Coupon.paginate(searchQuery, options);
    if (!coupon || coupon.docs.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy danh sách mã giảm giá",
      });
    }

    return res.status(200).json({
      message: "Lấy danh sách phiếu giảm giá thành công",
      coupon: coupon.docs,
      paginattion: {
        currentPage: coupon.page,
        totalPages: coupon.totalPages,
        totalItems: coupon.totalDocs,
        limit: coupon.limit,
      },
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getOneCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        message: `Không tìm thấy mã giảm giá có ID ${req.params.id}`,
      });
    }
    return res.status(200).json({
      message: `Lấy thông tin mã giảm giá có ID ${req.params.id} thành công`,
      coupon,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};
