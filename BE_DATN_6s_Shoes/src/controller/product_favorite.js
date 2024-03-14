import Favorite from "../model/product_favorite.js";
import Product from "../model/product.js";
import User from "../model/user.js";

export const addProductToFavorite = async (req, res) => {
  const { user_id, product_id } = req.body;
  try {
    if (!user_id) {
      return res.status(400).json({
        message: `Bạn cần đăng nhập mới thực hiện được chức năng này`,
      });
    }

    const exisUser = await User.findById(user_id);
    if (!exisUser) {
      return res
        .status(400)
        .json({ message: `Tài khoản có ID ${user_id} không tồn tại` });
    }

    const exisProduct = await Product.findById(product_id);
    if (!exisProduct) {
      return res
        .status(400)
        .json({ message: `Sản phẩm có ID ${product_id} không tồn tại` });
    }

    let favorite = await Favorite.findOne({ user_id });
    if (!favorite) {
      favorite = await Favorite.create({
        user_id,
        products: [],
      });
      await User.findByIdAndUpdate(user_id, {
        favorite_id: favorite._id,
      });
    }

    const productIndex = favorite.products.findIndex(
      product => product.toString() === product_id
    );
    if (productIndex === -1) {
      favorite.products.push(product_id);
      if (exisProduct.favorite_count < 0) {
        exisProduct.favorite_count = 0;
      }
      exisProduct.favorite_count++;
      await exisProduct.save();
      await favorite.save();
      return res.status(200).json({
        message: "Sản phẩm đã được đưa vào danh sách yêu thích",
        favorite,
        success: true,
        status: 0,
      });
    } else {
      favorite.products.splice(productIndex, 1);
      exisProduct.favorite_count--;
      await exisProduct.save();
      await favorite.save();

      return res.status(200).json({
        message: "Sản phẩm đã bị xóa khỏi danh sách yêu thích",
        favorite,
        success: true,
        status: 1,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

export const getTopFavoriteProducts = async (req, res) => {
  try {
    const topFavorites = await Favorite.aggregate([
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: "$products",
          totalFavorites: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $project: {
          _id: 0,
          product_name: "$productDetails.product_name",
          totalFavorites: 1,
        },
      },
      {
        $sort: { totalFavorites: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    return res.status(200).json({
      message: "Top 10 sản phẩm được yêu thích",
      topFavorites,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

export const getFavoriteProductsByUserId = async (req, res) => {
  const { user_id } = req.params;
  try {
    const favorite = await Favorite.findOne({ user_id }).populate("products");
    if (!favorite) {
      return res.status(400).json({
        message: `Không tìm thấy danh sách sản phẩm yêu thích của người dùng có ID ${user_id}`,
      });
    }
    return res.status(200).json({
      message: `Danh sách sản phẩm yêu thích của người dùng có ID ${user_id}`,
      favorite,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};
