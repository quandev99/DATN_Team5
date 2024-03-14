import Review from "../model/review.js";
import User from "../model/user.js";
import Product from "../model/product.js";
import Bill from "../model/bill.js";
import { reviewCreateSchema } from "../schema/review.js";

export const createReview = async (req, res) => {
  const {
    user_id,
    product_id,
    review_rating,
    review_content,
    review_image,
    bill_id,
  } = req.body;

  try {
    const { error } = reviewCreateSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    if (!user_id) {
      return res.status(400).json({
        message: "Bạn cần đăng nhập để thực hiện chức năng này",
      });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).json({
        message: `Tài khoản với ID ${user_id} không tồn tại`,
      });
    }

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(400).json({
        message: `Sản phẩm với ID ${product_id} không tồn tại`,
      });
    }

    const existingReview = await Review.findOne({
      user_id,
      product_id,
      bill_id,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "Bạn đã đánh giá sản phẩm này trước đó." });
    }

    const bill = await Bill.findOne({ _id: bill_id }).populate(
      "payment_status"
    );

    if (!bill || bill.payment_status.pStatus_name !== "Delivered") {
      return res.status(400).json({
        message:
          "Bạn cần mua và nhận giao sản phẩm thành công trước khi đánh giá.",
      });
    }

    const dataReview = {
      user_fullname: user.user_fullname,
      user_avatar: user.user_avatar,
      user_id,
      product_id,
      review_rating,
      review_content,
      review_image,
      bill_id,
    };

    const review = await Review.create(dataReview);
    if (!review) {
      return res.status(400).json({
        message: "Đánh giá sản phẩm thất bại",
      });
    }

    const reviews = await Review.find({ product_id });
    const totalRating = reviews.reduce(
      (totalRating, review_rating) => totalRating + review_rating.review_rating,
      0
    );

    const reviewCount = reviews.length;
    const averageScore = totalRating / reviewCount;

    product.average_score = Math.round(averageScore);
    product.review_count = reviewCount;
    await product.save();

    bill.isReview = true;
    bill.save();

    return res.status(200).json({
      message: "Đánh giá sản phẩm thành công",
      review,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getReviewProductID = async (req, res) => {
  const {
    _page = 1,
    _sort = "createdAt",
    _limit = 2,
    _order = "asc",
  } = req.query;

  const options = {
    page: _page,
    sort: { [_sort]: _order === "asc" ? -1 : 1 },
    limit: _limit,
  };
  const { id } = req.params;

  try {
    const reviews = await Review.paginate({ product_id: id }, options);

    if (!reviews || reviews.docs.length === 0) {
      return res.status(400).json({
        message: `Không tìm thấy danh sách đánh giá nào cho người dùng`,
      });
    }
 await Review.populate(reviews.docs, [
   {
     path: "user_id",
   },
 ]);
    return res.status(200).json({
      message: `Lấy được danh sách đánh giá bằng id sản phẩm`,
      review: reviews.docs,
      pagination: {
        currentPage: reviews.page,
        totalPages: reviews.totalPages,
        totalItems: reviews.totalDocs,
        limit: reviews.limit,
      },
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

export const getAllReviews = async (req, res) => {
  const {
    _page = 1,
    _sort = "createdAt",
    _limit = 10,
    _order = "asc",
  } = req.query;

  const options = {
    page: _page,
    sort: { [_sort]: _order === "asc" ? -1 : 1 },
    limit: _limit,
  };
  try {
    const reviews = await Review.paginate({}, options);
    if (!reviews || reviews.docs.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy đánh giá nào",
      });
    }
    res.status(200).json({
      message: "Danh sách đánh giá",
      reviews: reviews.docs,
      pagination: {
        currentPage: reviews.page,
        totalPages: reviews.totalPages,
        totalItems: reviews.totalDocs,
        limit: reviews.limit,
      },
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi máy chủ: " + error.message,
    });
  }
};

export const deleteReviewById = async (req, res) => {
  const reviewId = req.params.reviewId;
  try {
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      return res.status(404).json({
        message: `Không tìm thấy đánh giá với ID ${reviewId}`,
      });
    }
    res.status(200).json({
      message: "Xóa đánh giá thành công",
      review: review,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi máy chủ: " + error.message,
    });
  }
};
