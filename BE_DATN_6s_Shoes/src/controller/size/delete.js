import Size from "../../model/size.js";

export const deleteSizeById = async (req, res) => {
  const id = req.params.id;
  try {
    const size = await Size.findById({ _id: id });
    if (!size || size.length === 0) {
      return res.status(404).json({
        message: `Không tìm thấy giá trị size !`,
      });
    }
    if (size.products.length > 0) {
      return res.status(404).json({
        message: `Không thể xóa kích cỡ này vì có sản phẩm thuộc size này`,
      });
    }

    const DeleteSize = await Size.findByIdAndDelete({ _id: id });
    if (!DeleteSize) {
      return res.status(404).json({
        message: ` Xóa thương size không thành công !`,
      });
    }
    return res.status(200).json({
      message: ` Xóa size giá trị : ${size.size_name} thành công !`,
      DeleteSize,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error server!",
    });
  }
};
export const deleteSizeBySlug = async (req, res) => {
  const slug = req.params.slug;
  try {
    const size = await Size.findOne({ slug: slug });
    if (!size || size.length === 0) {
      return res.status(404).json({
        message: `Không tìm thấy giá trị size !`,
      });
    }
    const DeleteSize = await Size.findOneAndDelete({ slug: slug });
    if (!DeleteSize) {
      return res.status(404).json({
        message: ` Xóa thương size không thành công !`,
      });
    }
    return res.status(200).json({
      message: ` Xóa size giá trị : ${slug} thành công !`,
      DeleteSize,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error server!",
    });
  }
};
