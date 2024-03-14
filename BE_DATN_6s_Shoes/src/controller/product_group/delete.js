import Product from "../../model/product.js";
import Group from "../../model/group.js";

export const deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.id;

    const checkNameGroup = await Group.findOne({
      group_name: "Chưa phân loại",
    });
    if (groupId === checkNameGroup?._id.toString()) {
      return res.status(400).json({
        message: "Không được phép xóa nhóm sản phẩm 'Chưa phân loại'",
      });
    }

    const deletedGroup = await Group.findByIdAndDelete({
      _id: groupId,
    });

    if (!deletedGroup) {
      return res.status(404).json({
        message: "Xóa nhóm sản phẩm thất bại",
      });
    }

    await Product.updateMany(
      { group_id: groupId },
      { group_id: checkNameGroup._id }
    );

    return res.status(200).json({
      message: `Xóa nhóm sản phẩm thành công`,
      group: deletedGroup,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server: xóa group không thành công " + error.message,
    });
  }
};
