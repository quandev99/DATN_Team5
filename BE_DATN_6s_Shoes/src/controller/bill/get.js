import Bill from "../../model/bill.js";
import Payment_Status from "../../model/payment_status.js";

export const getAllBill = async (req, res) => {
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
    const bills = await Bill.paginate(searchQuery, options);
    if (!bills || bills.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy hóa đơn nào!",
      });
    }
    await Bill.populate(bills.docs, [
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
      message: "Lấy danh sách hóa đơn thành công",
      bills: bills.docs,
      pagination: {
        currentPage: bills.page,
        totalPages: bills.totalPages,
        totalItems: bills.totalDocs,
        limit: bills.limit,
      },
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getBillByUser = async (req, res) => {
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
      { user_id: userId, ...searchQuery },
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

export const getBillById = async (req, res) => {
  const billId = req.params.billId;

  try {
    const bill = await Bill.findById(billId).populate([
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

    if (!bill) {
      return res.status(400).json({
        message: `Không tìm thấy hóa đơn với ID ${billId}`,
      });
    }

    return res.status(200).json({
      message: `Danh sách hóa đơn theo ID ${billId}`,
      bill: bill,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi máy chủ: " + error.message,
    });
  }
};

export const getOneBillById = async (req, res) => {
  const { billId } = req.params;
  try {
    const bill = await Bill.findById(billId)
      .populate("products.product_id")
      .populate("user_id");

    if (!bill) {
      return res.status(400).json({
        message: "Không tìm thấy hóa đơn!",
      });
    }

    return res.status(200).json({
      message: "Lấy hóa đơn thành công!",
      bill,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getYearlyRevenue = async (req, res) => {
  const currentYear = new Date().getFullYear();
  const numberOfYears = 10;

  try {
    const yearlyData = [];

    const paymentStatus = await Payment_Status.find({
      pStatus_name: { $in: ["Delivered", "Reviews"] },
    });

    for (let i = 0; i < numberOfYears; i++) {
      const targetYear = currentYear - i;

      const startOfYear = new Date(Date.UTC(targetYear, 0, 1, 0, 0, 0));
      const endOfYear = new Date(Date.UTC(targetYear, 11, 31, 23, 59, 59));

      const bills = await Bill.find({
        createdAt: {
          $gte: startOfYear,
          $lte: endOfYear,
        },
        pStatus_name: paymentStatus.pStatus_name,
        status: "Paid",
      });

      const yearlyTotal = bills.reduce(
        (total, bill) => total + bill.bill_totalOrder,
        0
      );

      yearlyData.push({
        year: targetYear,
        total: yearlyTotal,
      });
    }

    res.json(yearlyData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi trong quá trình xử lý." });
  }
};

export const getMonthlyRevenue = async (req, res) => {
  const { year } = req.params;
  let annualTotal = 0;

  try {
    const monthlyData = [];

    const paymentStatus = await Payment_Status.find({
      pStatus_name: { $in: ["Delivered", "Reviews"] },
    });

    for (let month = 1; month <= 12; month++) {
      const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
      const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59));

      const bills = await Bill.find({
        createdAt: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
        pStatus_name: paymentStatus.pStatus_name,
        status: "Paid",
      });

      const monthlyTotal = bills.reduce(
        (total, bill) => total + bill.bill_totalOrder,
        0
      );
      monthlyData.push({
        month: month,
        year: year,
        total: monthlyTotal,
      });

      annualTotal += monthlyTotal;
    }

    res.json({ year: year, monthlyData: monthlyData, total: annualTotal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi trong quá trình xử lý." });
  }
};

export const getWeeklyRevenue = async (req, res) => {
  const { year, month } = req.params;
  let annualTotal = 0;

  try {
    const weeklyData = [];

    const paymentStatus = await Payment_Status.find({
      pStatus_name: { $in: ["Delivered", "Reviews"] },
    });

    const weeksInMonth = Math.ceil(new Date(year, month, 0).getDate() / 7);

    for (let week = 1; week <= weeksInMonth; week++) {
      const startOfWeek = new Date(
        Date.UTC(year, month - 1, (week - 1) * 7 + 1, 0, 0, 0)
      );
      const endOfWeek = new Date(
        Date.UTC(year, month - 1, week * 7, 23, 59, 59)
      );

      const bills = await Bill.find({
        createdAt: {
          $gte: startOfWeek,
          $lte: endOfWeek,
        },
        pStatus_name: paymentStatus.pStatus_name,
        status: "Paid",
      });

      const weeklyTotal = bills.reduce(
        (total, bill) => total + bill.bill_totalOrder,
        0
      );

      weeklyData.push({
        week: week,
        year: year,
        startOfWeek: startOfWeek.toISOString(),
        endOfWeek: endOfWeek.toISOString(),
        total: weeklyTotal,
      });

      annualTotal += weeklyTotal;
    }
    res.json({
      year: year,
      month: month,
      weeklyData: weeklyData,
      total: annualTotal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi trong quá trình xử lý." });
  }
};
