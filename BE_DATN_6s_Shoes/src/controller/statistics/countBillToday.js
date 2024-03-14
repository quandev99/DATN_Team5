import Bill from "../../model/bill.js";
import moment from "moment";

export const CountBillToday = async (req, res) => {
  try {
    const today = moment().startOf("day");
    const endOfDay = moment().endOf("day");

    const billsCount = await Bill.countDocuments({
      createdAt: {
        $gte: today.toDate(),
        $lte: endOfDay.toDate(),
      },
    });

    return res.status(200).json({
      message: "Tính số lượng đơn hàng trong ngày thành công",
      billsCount,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
