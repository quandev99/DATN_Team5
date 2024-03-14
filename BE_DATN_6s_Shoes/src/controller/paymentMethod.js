import PaymentMethod from "../model/paymentMethod.js";
import {
  addSchemaPaymentMethod,
  updateSchemaPaymentMethod,
} from "../schema/paymentMethod.js";

export const createPaymentMethod = async (req, res) => {
  const reqBody = req.body;
  const { pMethod_name } = req.body;
  try {
    const { error } = addSchemaPaymentMethod.validate(reqBody, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map(err => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    const checkName = await PaymentMethod.findOne({
      pMethod_name: pMethod_name,
    });

    if (checkName) {
      return res.status(400).json({
        message: "tên phương thức thanh toán  bị trùng !",
      });
    }
    const paymentmethod = await PaymentMethod.create(reqBody);
    if (!paymentmethod) {
      return res.status(400).json({
        message: "Thêm phương thức thanh toán thất bại !",
      });
    }
    return res.status(200).json({
      message: "Thêm phương thức thanh toán thành công !",
      paymentmethod,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error || "Error server",
    });
  }
};

export const getAllPaymentMethod = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find();

    if (paymentMethods.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Danh sách tất cả các phương thức thanh toán",
        paymentMethods,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phương thức thanh toán nào.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error || "Lỗi server",
    });
  }
};

export const removePaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findByIdAndDelete(req.params.id);
    if (!paymentMethod) {
      return res.status(404).json({
        message: "Xóa phương thức thanh toán thất bại",
      });
    }
    return res.status(200).json({
      message: "Xóa phương thức thanh toán thành công!",
      paymentMethod,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Lỗi server" + error.message,
    });
  }
};

export const getPaymentMethodByID = async (req, res) => {
  const id = req.params.id;
  try {
    const paymentMethod = await PaymentMethod.findById(id);
    if (!paymentMethod || paymentMethod.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy phương thức thanh toán !",
      });
    }
    return res.status(200).json({
      success: true,
      message: ` Lấy dữ liệu phương thức thành toán có id :${id} : và tên:  ${paymentMethod.pMethod_name} thành công !`,
      paymentMethod,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "error server :((",
    });
  }
};

export const updatePaymentMethod = async (req, res) => {
  const id = req.params.id;
  const { pMethod_name } = req.body;
  const body = req.body;

  try {
    const existingPMethod = await PaymentMethod.findOne({ pMethod_name });
    if (existingPMethod && existingPMethod._id.toString() === id) {
      return res.status(200).json({
        message: "Không có gì thay đổi",
        paymentMethod: existingPMethod,
      });
    }
    const { error } = updateSchemaPaymentMethod.validate(body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: error.details.map(error => error.message),
      });
    }

    const newNameLowerCase = pMethod_name.toLowerCase();

    const existingPaymentMethod = await PaymentMethod.findOne({
      pMethod_name: { $regex: new RegExp(`^${newNameLowerCase}$`, "i") },
    });

    if (existingPaymentMethod && existingPaymentMethod._id.toString() === id) {
      return res.json({
        message: "Tên phương thức chưa thay đổi gì",
        paymentMethod: existingPaymentMethod,
      });
    }
    if (existingPaymentMethod && existingPaymentMethod._id.toString() !== id) {
      return res.json({
        message: "Trùng tên với phương thức thanh toán khác",
      });
    }

    const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(
      id,
      { ...body },
      {
        new: true,
      }
    );

    if (!updatedPaymentMethod) {
      return res.status(404).json({
        message: "Cập nhật thất bại",
      });
    }

    return res.json({
      message: "Cập nhật phương thức thanh toán thành công",
      paymentMethod: updatedPaymentMethod,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
