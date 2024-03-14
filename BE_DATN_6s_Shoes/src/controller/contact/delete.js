import Contact from "../../model/contact.js";

export const deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteContact = await Contact.findByIdAndDelete(id);

    if (!deleteContact) {
      return res.status(400).json({
        message: "Xóa phản hồi thất bại",
      });
    }

    return res.status(200).json({
      message: "Xóa phản hồi thành công",
      deleteContact,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error Server",
    });
  }
};
