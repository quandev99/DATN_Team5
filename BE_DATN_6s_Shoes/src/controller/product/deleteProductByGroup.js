import Product from "../../model/product.js"; // Import model Product
import Product_Group from "../../model/group.js"; // Import model Product

export const deleteProductFromGroup = async (req, res) => {
  const { group_id, product_id } = req.body;
  try {
    const group = await Product_Group.findById(group_id);

    if (!group) {
      return res.status(400).json({
        message: `Không tìm thấy thông tin sản phẩm trong chiến dịch`,
      });
    }

    if (!product_id) {
      return res.status(400).json({
        message: `Không tìm thấy thông tin sản phẩm trong chiến dịch cần xóa`,
      });
    }

    // Tạo một mảng mới chỉ chứa những sản phẩm không trùng với sản phẩm cần xóa
    group.products = group.products.filter(
      (product) => product._id != product_id
    );

    await group.save();

    // Cập nhật `group_id` của sản phẩm trong bảng `Product`
    await Product.updateOne(
      { _id: product_id },
      { $unset: { group_id: undefined } }
    );
    return res.status(200).json({
      message: `Xóa sản phẩm khỏi chiến dịch thành công`,
      group,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Lỗi server: xóa sản phẩm khỏi chiến dịch không thành công " +
        error.message,
    });
  }
};
