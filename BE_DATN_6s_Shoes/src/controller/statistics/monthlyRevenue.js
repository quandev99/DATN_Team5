import Bill from "../../model/bill.js";
import Payment_Status from "../../model/payment_status.js";

export const getMonthlyRevenue = async (req, res) => {
  const { year } = req.params;
  let annualTotal = 0;

  try {
    const monthlyData = [];

    for (let month = 1; month <= 12; month++) {
      const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
      const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59));

      const bills = await Bill.find({
        createdAt: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
        pStatus_name: "Delivered",
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
