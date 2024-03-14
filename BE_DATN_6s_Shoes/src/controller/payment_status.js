import Payment_Status from "../model/payment_status.js";
import {
  pStatusAddSchema,
  pStatusUpdateSchema,
} from "../schema/payment_status.js";

export const createPaymentStatus = async (req, res) => {
  const formData = req.body;
  const { pStatus_name } = req.body;
  try {
    const { error } = pStatusAddSchema.validate(formData, {
      abortEarly: false,
    });
    const checkName = await Payment_Status.findOne({ pStatus_name });
    if (checkName) {
      return res.status(400).json({
        message: "Tên trạng thái đã tồn tại !",
      });
    }

    if (error) {
      const errors = error.details.map(err => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    const DataPaymentStatus = { ...formData };
    const paymentStatus = await Payment_Status.create(DataPaymentStatus);
    if (!paymentStatus) {
      return res.status(404).json({
        error: "Tạo trạng thái giá thất bại",
      });
    }
    return res.status(200).json({
      message: "Tạo trạng thái thành công",
      paymentStatus,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getOnePaymentStatusById = async (req, res) => {
  try {
    const payment_status = await Payment_Status.findById(req.params.id);
    if (!payment_status) {
      return res.status(404).json({
        message: `Không tìm thấy Payment Status có ID ${req.params.id}`,
      });
    }
    return res.status(200).json({
      message: `Lấy Payment Status có ID ${req.params.id} thành công`,
      payment_status,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

export const getAllPaymentStatus = async (req, res) => {
  const {
    _page = 1,
    _limit = 100,
    _sort = "order_sort",
    _order = "asc",
  } = req.query;

  const options = {
    page: _page,
    limit: _limit,
    sort: { [_sort]: _order === "asc" ? 1 : -1 },
  };

  try {
    const dstatus = await Payment_Status.paginate({ status: false }, options);
    if (!dstatus || dstatus?.docs?.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy danh sách vai trò",
      });
    }

    return res.status(200).json({
      message: "Lấy thành công danh sách nhóm sản phẩm",
      dstatus: dstatus.docs,
      pagination: {
        currentPage: dstatus.page,
        totalPages: dstatus.totalPages,
        totalItems: dstatus.totalDocs,
        limit: dstatus.limit,
      },
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi máy chủ: " + error.message,
    });
  }
};

export const removePaymentStatus = async (req, res) => {
  try {
    const paymentStatus = await Payment_Status.findByIdAndDelete(req.params.id);
    if (!paymentStatus) {
      return res.status(404).json({
        message: "Xóa trạng thái thanh toán thất bại",
      });
    }
    return res.status(200).json({
      message: "Xóa trạng thái thanh toán thành công!",
      paymentStatus,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({ message: "Lỗi server" + error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  const id = req.params.id;
  const { pStatus_name } = req.body;
  const body = req.body;

  try {
    const { error } = pStatusUpdateSchema.validate(body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: error.details.map(error => error.message),
      });
    }
    const existingpStatus = await Payment_Status.findOne({ pStatus_name });
    if (existingpStatus && existingpStatus._id.toString() === id) {
      return res.json({
        message: "Không có gì thay đổi",
        payment_status: existingpStatus,
      });
    }
    if (existingpStatus && existingpStatus._id.toString() !== id) {
      return res.json({
        message: "Trùng tên với payment_status khác",
      });
    }

    const payment_status = await Payment_Status.findByIdAndUpdate(
      id,
      { ...body },
      {
        new: true,
      }
    );

    if (!payment_status) {
      return res.status(400).json({
        message: "Không tìm thấy payment_status",
      });
    }

    payment_status.product_count = payment_status.products?.length;

    return res.json({
      message: "Cập nhật payment_status thành công",
      payment_status,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
