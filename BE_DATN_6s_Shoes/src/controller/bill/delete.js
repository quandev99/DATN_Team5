import Bill from "../../model/bill.js";
import Payment_status from "../../model/payment_status.js";
import Variant_Product from "../../model/variant_product.js";

// GET ONE BILL
export const deleteBillById = async (req, res) => {
  const { id } = req.params;
  try {
    const bill = await Bill.findById(id).populate([
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
        message: "Không tìm thấy hóa đơn!",
      });
    }

    let abortStatus = await Payment_status.findOne({
      pStatus_name: "Abort",
    });
    let confirmStatus = await Payment_status.findOne({
      pStatus_name: "Confirmed",
    });

    if (!abortStatus) {
      abortStatus = await Payment_status.create({ pStatus_name: "Abort" });
    }

    if (!confirmStatus) {
      confirmStatus = await Payment_status.create({
        pStatus_name: "Confirmed",
      });
    }

    if (
      bill.pStatus_name === "Delivered" ||
      bill.pStatus_name === "Delivering"
    ) {
      return res.status(400).json({
        message: "Không thể hủy đơn đang trong quá trình vận chuyển!",
      });
    }

    if (bill.pStatus_name === "Confirmed") {
      bill.payment_status = confirmStatus._id;
      bill.save();
      return res.status(400).json({
        message: "Đơn hàng đang được xử lý!",
        bill,
      });
    }

    bill.payment_status = abortStatus._id;
    bill.pStatus_name = abortStatus.pStatus_name;
    bill.save();

    const products = bill.products;
    for (const product of products) {
      const variantProduct = await Variant_Product.findById(
        product.variant_product_id
      );
      if (variantProduct) {
        variantProduct.variant_quantity += product.quantity;
        await variantProduct.save();
      }
    }

    return res.status(200).json({
      message: "Hủy đơn hàng thành công!",
      bill,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteBillByUserId = async (req, res) => {
  const { id } = req.params;
  try {
    const bill = await Bill.findById(id);
    if (!bill) {
      return res.status(400).json({
        message: "Không tìm thấy hóa đơn!",
      });
    }
    const Status = await Payment_status.findById(bill.payment_status);

    if (
      Status.pStatus_name === "Delivering" ||
      bill.pStatus_name === "Delivered"
    ) {
      return res.status(400).json({
        message: "Không thể hủy đơn đang trong quá trình vận chuyển!",
      });
    }

    if (
      Status.pStatus_name === "Confirmed" ||
      bill.pStatus_name === "Confirmed"
    ) {
      return res.status(400).json({
        message: "Không thể hủy đơn đang trong quá trình vận chuyển!",
      });
    }

    let abortStatus = await Payment_status.findOne({
      pStatus_name: "Abort",
    });

    if (!abortStatus) {
      abortStatus = await Payment_status.create({ pStatus_name: "Abort" });
    }

    bill.payment_status = abortStatus._id;
    bill.save();

    const products = bill.products;
    for (const product of products) {
      const variantProduct = await Variant_Product.findById(
        product.variant_product_id
      );
      if (variantProduct) {
        variantProduct.variant_quantity += product.quantity;
        await variantProduct.save();
      }
    }

    return res.status(200).json({
      message: "Hủy đơn hàng thành công!",
      bill,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
