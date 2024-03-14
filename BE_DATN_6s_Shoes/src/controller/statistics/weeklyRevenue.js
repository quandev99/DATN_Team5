import Bill from "../../model/bill.js";
import Payment_Status from "../../model/payment_status.js";

export const getWeeklyRevenue = async (req, res) => {
  const { year, month } = req.params;
  let annualTotal = 0;

  try {
    const weeklyData = [];

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
        pStatus_name: "Delivered",
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
