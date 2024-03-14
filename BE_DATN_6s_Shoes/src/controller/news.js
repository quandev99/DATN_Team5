import News from "../model/news.js";
import User from "../model/user.js";
import Product from "../model/product.js";
import { NewsSchema } from "../schema/news.js";

export const createNews = async (req, res) => {
  const { news_title, product_id, user_id } = req.body;
  const formData = req.body;
  try {
    let checkTitle;

    if (news_title !== "") {
      checkTitle = await News.findOne({ news_title });
      if (checkTitle) {
        return res.status(400).json({
          message: "Tiêu đề đã tồn tại",
        });
      }
    }

    if (news_title !== "") {
      const { error } = NewsSchema.validate(formData);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
        });
      }
    }

    const existingProduct = await Product.findById(product_id);
    if (!existingProduct) {
      return res.status(400).json({
        message: "Product không tồn tại",
      });
    }

    const existingUser = await User.findById(user_id);
    if (!existingUser) {
      return res.status(400).json({
        message: "User không tồn tại",
      });
    }

    const dataNews = {
      ...formData,
      news_title: news_title || "",
    };

    const news = await News.create(dataNews);

    await Product.findOneAndUpdate(
      { _id: product_id },
      {
        $addToSet: {
          news: news._id,
        },
      }
    );
    await User.findOneAndUpdate(
      { _id: user_id },
      {
        $addToSet: {
          news: news._id,
        },
      }
    );
    await news.save();

    if (!news || news.length === 0) {
      return res.status(400).json({
        message: "Thêm bài viết thất bại",
      });
    }
    return res.json({
      message: "Thêm bài viết thành công",
      news,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

export const updateNews = async (req, res) => {
  const id = req.params.id;

  const formData = req.body;
  const { createdAt, updatedAt, ...rest } = req.body;

  const { news_title, product_id, user_id, news_content, news_image } =
    req.body;

  try {
    const existingNews = await News.findById(id);
    if (!existingNews) {
      return res.status(400).json({
        message: "Bài viết không tồn tại",
      });
    }

    const checkTitle = await News.findOne({ news_title });
    if (checkTitle && checkTitle._id.toString() !== id) {
      return res.status(400).json({
        message: "Không tìm thấy thông tin bài viết!",
      });
    }

    const checkIsChange = await News.findOne({ ...rest });
    if (checkIsChange) {
      return res.status(400).json({
        message: "Bài viết k có thay đổi",
      });
    }

    // Check if size_name is changed and conflicts with existing data
    const newsWithSameName = await News.findOne({ news_title });
    if (newsWithSameName && newsWithSameName._id.toString() !== id) {
      return res.status(400).json({
        message: "Tiêu đề đã tồn tại trong cơ sở dữ liệu",
      });
    }

    const existingProduct = await Product.findById(product_id);
    if (!existingProduct) {
      return res.status(400).json({
        message: "Sản phẩm không tồn tại",
      });
    }

    const existingUser = await User.findById(user_id);
    if (!existingUser) {
      return res.status(400).json({
        message: "Tài khoản không tồn tại",
      });
    }

    const dataNews = {
      news_title,
      news_content,
      news_image,
      product_id,
      user_id,
    };

    const updatedNews = await News.findOneAndUpdate({ _id: id }, dataNews, {
      new: true,
    });

    if (!updatedNews || updatedNews.length === 0) {
      return res.status(400).json({
        message: "Sửa bài viết thất bại",
      });
    }

    return res.json({
      message: "Sửa bài viết thành công",
      news: updatedNews,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

export const listNews = async (req, res) => {
  const {
    _page = 1,
    _sort = "createAt",
    _limit = 10,
    _order = "asc",
  } = req.query;

  const options = {
    page: _page,
    sort: { [_sort]: _order === "asc" ? -1 : 1 },
    limit: _limit,
  };
  try {
    const news = await News.paginate({}, options);
    if (news.docs.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy bài viết nào",
      });
    }

    return res.status(200).json({
      message: "Danh sách bài viết",
      news: news.docs,
      success: true,
      pagination: {
        currentPage: options.currentPage,
        totalPages: options.totalPages,
        totalItems: news.length,
        limit: options.limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi máy chủ: " + error.message,
    });
  }
};

export const listNewsByUser = async (req, res) => {
  try {
    const user_id = req.params.id;
    const news = await News.findOne({ user_id })
      .populate("product_id", "product_name")
      .populate("user_id", "user_fullname");
    if (news.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy bài viết nào cho người dùng này",
      });
    }

    res.status(200).json({
      message: "Danh sách bài viết của người dùng",
      news: news,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi máy chủ: " + error.message,
    });
  }
};

export const listNewsById = async (req, res) => {
  const { id } = req.params;
  try {
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({
        message: "Không tìm thấy bài viết",
      });
    }

    res.status(200).json({
      message: "Hiển thị bài viết thành công",
      news,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi máy chủ: " + error.message,
    });
  }
};

export const deleteNews = async (req, res) => {
  const newsId = req.params.newsId;
  try {
    const deletedNews = await News.findByIdAndDelete(newsId);
    if (!deletedNews) {
      return res.status(404).json({
        message: "Bài viết không tồn tại",
      });
    }
    res.status(200).json({
      message: "Xóa bài viết thành công",
      news: deletedNews,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi máy chủ: " + error.message,
    });
  }
};
