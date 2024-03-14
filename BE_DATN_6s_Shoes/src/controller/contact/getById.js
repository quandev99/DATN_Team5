import Contact from "../../model/contact.js";

export const getContactById = async (req, res) => {
  const id = req.params.id;
  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(400).json({
        message: "Không tìm thấy thông tin phản hồi",
      });
    }
    return res.status(200).json({
      message: `Lấy dữ liệu phản hồi theo id ${id} thành công!`,
      contact,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};
