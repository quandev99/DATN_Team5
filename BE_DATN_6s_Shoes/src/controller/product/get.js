import Product from "../../model/product.js";

export const getAllProduct = async (req, res) => {
  const {
    _page = 1,
    _sort = "createdAt",
    _limit = 20,
    _order = "asc",
    _search = "",
    _product_code = "",
    _category_id = "",
    _brand_id = "",
    _color_id,
    _size_id,
    minPrice,
    maxPrice,
  } = req.query;
  const options = {
    page: _page,
    sort: { [_sort]: _order === "asc" ? -1 : 1 },
    limit: _limit,
  };

  try {
    const searchQuery = {};
    if (_category_id) {
      searchQuery.category_id = _category_id;
    }

    if (_brand_id) {
      searchQuery.brand_id = _brand_id;
    }

    if (_search || _product_code || minPrice || maxPrice) {
      searchQuery.$and = [];
      if (_search) {
        searchQuery.$and = [];
        searchQuery.$and.push({
          product_name: { $regex: _search, $options: "i" },
        });
      }
      if (_product_code) {
        searchQuery.$and.push({
          product_code: { $regex: _product_code, $options: "i" },
        });
      }
    }
    const products = await Product.paginate(searchQuery, options);

    if (!products || products.docs.length === 0)
      return res.status(400).json({
        message: "Không tìm thấy sản phẩm nào!",
      });
    await Product.populate(products.docs, [
      {
        path: "variant_products",
      },
    ]);

    if (minPrice || maxPrice || _color_id || _size_id) {
      const processedVariants = new Set();
      const filteredProducts = products?.docs?.filter((product) => {
        const hasMatchingVariant = product?.variant_products?.some(
          (variant) => {
            const variantId = variant._id;

            if (processedVariants.has(variantId)) {
              return false;
            }
            const price = variant.variant_price;
            const discount = variant.variant_discount;

            let hasPriceWithoutDiscount = 0;
            if (minPrice && maxPrice) {
              hasPriceWithoutDiscount =
                (!discount ? price : discount) >= +minPrice &&
                (!discount ? price : discount) <= +maxPrice;
            } else {
              hasPriceWithoutDiscount =
                (!discount ? price : discount) > minPrice ||
                (!discount ? price : discount) <= +maxPrice;
            }

            const colorMatch = _color_id
              ? variant?.color_id.toString() === _color_id
              : false;
            const sizeMatch = _size_id
              ? variant?.size_id.toString() === _size_id
              : false;

            return hasPriceWithoutDiscount || colorMatch || sizeMatch;
          }
        );
        return hasMatchingVariant;
      });
      if (filteredProducts.length > 0) {
        return res.status(200).json({
          message: "Lấy danh sách sản phẩm thành công",
          products: filteredProducts,
          pagination: {
            currentPage: products.page,
            totalPages: products.totalPages,
            totalItems: filteredProducts?.length,
            limit: products.limit,
          },
          success: true,
        });
      } else {
        return res.status(301).json({
          products: filteredProducts,
          message: "Không tìm thấy sản phẩm nào!",
        });
      }
    }
    return res.status(200).json({
      message: "Lấy danh sách sản phẩm thành công",
      products: products.docs,
      pagination: {
        currentPage: products.page,
        totalPages: products.totalPages,
        totalItems: products.totalDocs,
        limit: products.limit,
      },
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllProductClient = async (req, res) => {
  const {
    _page = 1,
    _sort = "createdAt",
    _limit = 20,
    _order = "asc",
    _search = "",
    _product_code = "",
    _category_id = "",
    _brand_id = "",
    _color_id,
    _size_id,
    minPrice,
    maxPrice,
  } = req.query;
  const sortObject = {};
  if (_sort === "createdAt") {
    sortObject.createdAt = _order === "asc" ? 1 : -1;
  } else if (_sort === "product_name") {
    sortObject.product_name = _order === "asc" ? 1 : -1;
  } else if (_sort === "product_view") {
    sortObject.product_view = _order === "desc" ? 1 : -1;
  } else if (_sort === "average_score") {
    sortObject.average_score = _order === "desc" ? 1 : -1;
  } else if (_sort === "favorite_count") {
    sortObject.favorite_count = _order === "desc" ? 1 : -1;
  } else if (_sort === "sold_quantity") {
    sortObject.sold_quantity = _order === "desc" ? 1 : -1;
  }
  const options = {
    page: _page,
    sort: sortObject,
    limit: _limit,
  };

  try {
    const searchQuery = {
      product_status: false,
    };

    if (_category_id) {
      searchQuery.category_id = _category_id;
    }
    if (_brand_id) {
      searchQuery.brand_id = _brand_id;
    }

   if (_search || _product_code) {
     searchQuery.$and = [];

     if (_search) {
       searchQuery.$and.push({
         $or: [
           { product_name: { $regex: _search, $options: "i" } },
           { product_code: { $regex: _search, $options: "i" } },
         ],
       });
     }

     if (_product_code) {
       searchQuery.$and.push({
         product_code: { $regex: _product_code, $options: "i" },
       });
     }
   }
    const products = await Product.paginate(searchQuery, options);

    if (!products || products.docs.length === 0)
      return res.status(400).json({
        message: "Không tìm thấy sản phẩm nào!",
      });
    await Product.populate(products.docs, [
      {
        path: "variant_products",
      },
    ]);

    if (minPrice || maxPrice || _color_id || _size_id) {
      const processedVariants = new Set();
      const filteredProducts = products?.docs?.filter((product) => {
        const hasMatchingVariant = product?.variant_products?.some(
          (variant) => {
            const variantId = variant._id;

            if (processedVariants.has(variantId)) {
              return false; // Bỏ qua nếu đã xử lý
            }
            const price = variant.variant_price;
            const discount = variant.variant_discount;

            let hasPriceWithoutDiscount = 0;
            if (minPrice && maxPrice) {
              hasPriceWithoutDiscount =
                (!discount ? price : discount) >= +minPrice &&
                (!discount ? price : discount) <= +maxPrice;
            } else {
              hasPriceWithoutDiscount =
                (!discount ? price : discount) > +minPrice ||
                (!discount ? price : discount) <= +maxPrice;
            }

            const colorMatch = _color_id
              ? variant?.color_id.toString() === _color_id
              : false;
            const sizeMatch = _size_id
              ? variant?.size_id.toString() === _size_id
              : false;

            return hasPriceWithoutDiscount || colorMatch || sizeMatch;
          }
        );
        return hasMatchingVariant;
      });
      if (filteredProducts.length > 0) {
        return res.status(200).json({
          message: "Lấy danh sách sản phẩm thành công",
          products: filteredProducts,
          pagination: {
            currentPage: products.page,
            totalPages: products.totalPages,
            totalItems: filteredProducts?.length,
            limit: products.limit,
          },
          success: true,
        });
      } else {
        return res.status(301).json({
          products: filteredProducts,
          message: "Không tìm thấy sản phẩm nào!",
        });
      }
    }
    return res.status(200).json({
      message: "Lấy danh sách sản phẩm thành công",
      pagination: {
        currentPage: products.page,
        totalPages: products.totalPages,
        totalItems: products.totalDocs,
        limit: products.limit,
      },
      products: products.docs,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getProductByIdAndCount = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOneAndUpdate(
      { _id: id },
      { $inc: { product_view: 1 } },
      { new: true }
    ).populate({
      path: "variant_products",
      populate: [
        {
          path: "_id",
          select:
            "product_name variant_quantity variant_discount variant_price color_id size_id",
          populate: [
            {
              path: "size_id",
              select: "size_name",
            },
            { path: "color_id", select: "color_name" },
          ],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        message: `Không tìm thấy sản phẩm có ID ${id}`,
      });
    }

    return res.status(200).json({
      message: `Thông tin sản phẩm có ID ${id}`,
      product,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

export const getProductBySlugAndCount = async (req, res) => {
  const { slug } = req.params;
  try {
    const product = await Product.findOneAndUpdate(
      { slug },
      { $inc: { product_view: 1 } },
      { new: true }
    ).populate({
      path: "variant_products",
      populate: [
        { path: "product_id", select: "product_name" },
        { path: "color_id", select: "color_name" },
        { path: "size_id", select: "size_name" },
      ],
    });

    if (!product) {
      return res.status(404).json({
        message: `Không tìm thấy sản phẩm có Slug ${slug}`,
      });
    }

    return res.status(200).json({
      message: `Thông tin sản phẩm có Slug ${slug}`,
      product,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};
