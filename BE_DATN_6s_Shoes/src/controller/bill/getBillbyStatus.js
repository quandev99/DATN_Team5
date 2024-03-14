import Bill from "../../model/bill.js";

export const getBillStatus = async (req, res) => {
  const {
    _page = 1,
    _sort = "createAt",
    _limit = 10,
    _order = "desc",
    _search = "",
  } = req.query;

  const options = {
    page: _page,
    sort: { [_sort]: _order === "desc" ? -1 : 1 },
    limit: _limit,
  };
  const { statusId } = req.params;

  try {
    const searchQuery = _search
      ? { bill_code: { $regex: _search, $options: "i" } }
      : {};

    const bills = await Bill.paginate(
      { payment_status: statusId, ...searchQuery },
      options
    );

    await Bill.populate(bills.docs, [
      {
        path: "user_id",
        select:
          "user_email user_fullname user_fullname user_avatar user_address user_phone user_username",
      },
      {
        path: "payment_status",
        select: "pStatus_name",
      },
      {
        path: "payment_method",
        select: "pMethod_name",
      },
    ]);

    if (!bills || bills.docs.length === 0) {
      return res.status(400).json({
        message: "Không có hóa đơn nào!",
      });
    }

    return res.status(200).json({
      message:
        "Lấy danh sách hóa đơn thông qua trạng thái đơn hàng thành công!",
      bills: bills.docs,
      success: true,
      pagination: {
        currentPage: bills.page,
        totalPages: bills.totalPages,
        totalItems: bills.totalDocs,
        limit: bills.limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getBillStatusByUser = async (req, res) => {
  const { user_id, payment_status_id } = req.params;
  const {
    _page = 1,
    _sort = "createdAt",
    _limit = 10,
    _order = "desc",
  } = req.query;

  const options = {
    page: _page,
    sort: { [_sort]: _order === "desc" ? -1 : 1 },
    limit: _limit,
  };

  const query = {
    user_id,
    payment_status: payment_status_id,
  };

  try {
    const userBills = await Bill.paginate(query, options);

    if (!userBills || userBills.docs.length === 0) {
      return res.status(400).json({
        message: `Không tìm thấy hóa đơn nào cho người dùng`,
      });
    }

    await Bill.populate(userBills.docs, [
      {
        path: "user_id",
        select:
          "user_email user_fullname user_fullname user_avatar user_address user_phone user_username",
      },
      {
        path: "payment_status",
        select: "pStatus_name pStatus_description",
      },
      {
        path: "payment_method",
        select: "pMethod_name pMethod_description",
      },
    ]);

    return res.status(200).json({
      message: `Lấy được danh sách hóa đơn bằng id người dùng`,
      bills: userBills.docs,
      pagination: {
        currentPage: userBills.page,
        totalPages: userBills.totalPages,
        totalItems: userBills.totalDocs,
        limit: userBills.limit,
      },
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi máy chủ: " + error.message,
    });
  }
};
