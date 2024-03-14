import Group from "../../model/group.js";
import VariantProduct from "../../model/variant_product.js";
export const getGroupById = async (req, res) => {
  const id = req.params.id;
  try {
    const group = await Group.findById(id).populate({
      path: "products",
      populate: {
        path: "variant_products", // Đường dẫn tới các biến thể sản phẩm
        model: VariantProduct, // Model của biến thể sản phẩm
      },
    });
    if (!group || group.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy phân vai trò !",
      });
    }
    return res.status(200).json({
      message: ` Lấy dữ liệu nhóm sản phẩm theo id : ${id} thành công !`,
      group,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "error server :((",
    });
  }
};
