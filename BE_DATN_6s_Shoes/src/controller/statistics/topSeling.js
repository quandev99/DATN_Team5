// Import moment và Bill model
import moment from "moment";
import Bill from "../../model/bill.js";
import Payment_status from "../../model/payment_status.js";

export const TopSelling = async (req, res) => {
  try {
    const currentDate = moment();

    const Develiver = await Payment_status.findOne({
      pStatus_name: "Delivered",
    });

    const startOfMonth = currentDate.clone().startOf("month");
    const endOfMonth = currentDate.clone().endOf("month");

    const productsWithQuantities = [];

    // Lấy tất cả hóa đơn của tháng hiện tại
    const billsInMonth = await Bill.find({
      createdAt: {
        $gte: startOfMonth.toDate(),
        $lt: endOfMonth.toDate(),
      },
      payment_status: Develiver,
    });

    if (billsInMonth.length === 0) {
      productsWithQuantities.push({
        monthYear: startOfMonth.format("MM-YYYY"),
        message: "Không có sản phẩm bán chạy trong tháng này.",
      });
    } else {
      const salesByProduct = {};
      billsInMonth.forEach((bill) => {
        bill.products.forEach((product) => {
          const product_id = product.product_id;
          const product_name = product.product_name;
          const quantity = product.quantity;

          if (!salesByProduct[product_id]) {
            salesByProduct[product_id] = 0;
          }

          salesByProduct[product_id] += quantity;
        });
      });

      const sortedProducts = Object.entries(salesByProduct).sort(
        (a, b) => b[1] - a[1]
      );

      sortedProducts.forEach(([product_id, quantity]) => {
        productsWithQuantities.push({
          monthYear: startOfMonth.format("MM-YYYY"),
          product_id,
          quantity,
        });
      });
    }

    res.json(productsWithQuantities);
  } catch (error) {
    console.error(
      "Lỗi khi lấy thông tin số lượng sản phẩm bán chạy trong tháng:",
      error
    );
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};
