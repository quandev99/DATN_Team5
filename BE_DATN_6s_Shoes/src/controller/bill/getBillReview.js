import Bill from "../../model/bill.js";

export const getBillByUserReviews = async (req, res) => {
  const userId = req.params.userId;
  const {
    _page = 1,
    _sort = "createdAt",
    _limit = 10,
    _order = "desc",
    _search,
  } = req.query;

  const options = {
    page: _page,
    sort: { [_sort]: _order === "desc" ? -1 : 1 },
    limit: _limit,
  };

  try {
    const searchQuery = _search
      ? { bill_code: { $regex: _search, $options: "i" } }
      : {};
    const userBills = await Bill.paginate(
      { user_id: userId, isReview: true, ...searchQuery },
      options
    );

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
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi máy chủ: " + error.message,
    });
  }
};
