import Contact from "../../model/contact.js";

export const getAllContact = async (req, res) => {
  const {
    _page = 1,
    _sort = "createdAt",
    _limit = 10,
    _order = "asc",
    _search = "",
  } = req.query;

  const options = {
    page: _page,
    sort: { [_sort]: _order === "asc" ? -1 : 1 },
    limit: _limit,
  };

  try {
    const searchQuery = _search
      ? { contact_email: { $regex: _search, $options: "i" } }
      : {};

    const contacts = await Contact.paginate(searchQuery, options);
    if (!contacts || contacts.docs.length === 0)
      return res.status(400).json({
        message: "Không tìm thấy thông tin phản hồi nào!",
      });

    return res.status(200).json({
      message: "Lấy danh sách phản hồi thành công",
      contacts: contacts.docs,
      pagination: {
        currentPage: contacts.page,
        totalPages: contacts.totalPages,
        totalItems: contacts.totalDocs,
        limit: contacts.limit,
      },
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error Server",
    });
  }
};
