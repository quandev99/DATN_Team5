import Bill from "../../model/bill.js";
import Product from "../../model/product.js"; // Import model của sản phẩm
import Payment_status from "../../model/payment_status.js"; // Import model của sản phẩm

export const getProductTopSale = async (req, res) => {
  try {
    const productsWithQuantities = [];

    const Develiver = await Payment_status.findOne({
      pStatus_name: "Delivered",
    }); // Lấy tất cả hóa đơn của tháng hiện tại
    const billsInMonth = await Bill.find({ payment_status: Develiver });

    if (billsInMonth.length === 0) {
      productsWithQuantities.push({
        message: "Không có sản phẩm bán chạy trong tháng này.",
      });
    } else {
      const salesByProduct = {};

      // Lặp qua từng hóa đơn trong tháng
      billsInMonth.forEach((bill) => {
        // Lặp qua từng sản phẩm trong hóa đơn
        bill.products.forEach(async (product) => {
          const product_id = product.product_id;
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

      for (const [product_id, quantity] of sortedProducts) {
        // Lấy thông tin sản phẩm từ ID
        const productInfo = await Product.findById(product_id);

        if (productInfo) {
          productsWithQuantities.push({
            product_id: productInfo._id,
            product_name: productInfo.product_name,
            quantity,
          });
        }
      }
    }

    return res.status(200).json(productsWithQuantities);
  } catch (error) {
    console.error(
      "Lỗi khi lấy thông tin số lượng sản phẩm bán chạy trong tháng:",
      error
    );
    res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
  }
};
