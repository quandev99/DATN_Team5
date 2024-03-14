import Bill from "../../model/bill.js";
import Payment_Status from "../../model/payment_status.js";

export const getYearlyRevenue = async (req, res) => {
  const currentYear = new Date().getFullYear();
  const numberOfYears = 10;

  try {
    const yearlyData = [];

    for (let i = 0; i < numberOfYears; i++) {
      const targetYear = currentYear - i;

      const startOfYear = new Date(Date.UTC(targetYear, 0, 1, 0, 0, 0));
      const endOfYear = new Date(Date.UTC(targetYear, 11, 31, 23, 59, 59));

      const bills = await Bill.find({
        createdAt: {
          $gte: startOfYear,
          $lte: endOfYear,
        },
        pStatus_name: "Delivered",
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
