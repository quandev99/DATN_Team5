import Product from "../../model/product.js";

export const getProductByCategory = async (req, res) => {
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
    const id = req.params.id;
    const products = await Product.find({
      category_id: id,
      product_status: false,
    }).populate({ path: "variant_products" });
    if (!products)
      return res.status(404).json({
        message: "Không có sản phẩm nào trong thương hiệu này",
        success: false,
      });

    const productResponse = { docs: products };
    return res.status(200).json({
      message: "Lấy ra các sản phẩm thuộc thương hiệu này thành công",
      success: true,
      productResponse,
      pagination: {
        currentPage: options.currentPage,
        totalPages: options.totalPages,
        totalItems: products.length,
        limit: options.limit,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      mes: error?.message,
    });
  }
};
