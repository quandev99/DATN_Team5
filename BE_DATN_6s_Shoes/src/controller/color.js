import Color from "../model/color.js";
import slugify from "slugify";
import { ColorAddSchema, colorUpdateSchema } from "./../schema/color.js";

async function createUniqueSlug(slug) {
  let uniqueSlug = slug;
  let counter = 1;
  while (true) {
    const existingColor = await Color.findOne({ slug: uniqueSlug });
    if (!existingColor) {
      break;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

export const createColor = async (req, res) => {
  const { color_name } = req.body;
  const formData = req.body;
  try {
    const checkName = await Color.findOne({ color_name });
    if (checkName) {
      return res.status(400).json({
        message: "Màu đã tồn tại",
      });
    }

    // validate
    const { error } = ColorAddSchema.validate(formData);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const slug = slugify(color_name, { lower: true });

    let uniqueSlug = await createUniqueSlug(slug);

    const dataColor = {
      ...formData,
      slug: uniqueSlug,
    };

    const color = await Color.create(dataColor);
    if (!color || color.length === 0) {
      return res.status(400).json({
        message: "Thêm màu thất bại",
      });
    }

    color.slug = uniqueSlug;
    await color.save();

    return res.json({
      message: "Thêm màu thành công",
      color,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

export const getColorById = async (req, res) => {
  const { id } = req.params;
  try {
    const color = await Color.findById(id);

    if (!color) {
      return res.status(404).json({
        message: `Không tìm thấy màu sắc có ID ${id}`,
      });
    }

    return res.status(200).json({
      message: `Thông tin màu sắc có ID ${id}`,
      color,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

export const getColorBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const color = await Color.findOne({ slug });

    if (!color) {
      return res.status(404).json({
        message: `Không tìm thấy màu sắc có Slug ${slug}`,
      });
    }

    return res.status(200).json({
      message: `Thông tin màu sắc có Slug ${slug}`,
      color,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};
export const getAllColor = async (req, res) => {
  try {
    const colors = await Color.find({});

    if (!colors || colors.length === 0) {
      return res.status(400).json({
        message: "Danh sách màu trống!",
      });
    }

    return res.status(200).json({
      message: "Lấy danh sách màu thành công",
      colors,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteColorById = async (req, res) => {
  const id = req.params.id;
  try {
    const color = await Color.findById({ _id: id });
    if (!color) {
      return res.status(404).json({
        message: "Không tìm thấy giá trị color!",
      });
    }

    const DeleteColor = await Color.findByIdAndDelete({ _id: id });
    if (!DeleteColor) {
      return res.status(404).json({
        message: "Xóa màu không thành công!",
      });
    }
    return res.status(200).json({
      message: `Xóa màu ${color.color_name} thành công!`,
      DeleteColor,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi máy chủ!",
    });
  }
};

export const deleteColorBySlug = async (req, res) => {
  const slug = req.params.slug;
  try {
    const color = await Color.findOne({ slug: slug });
    if (!color) {
      return res.status(404).json({
        message: "Không tìm thấy giá trị color!",
      });
    }

    const DeleteColor = await Color.findOneAndDelete({ slug: slug });
    if (!DeleteColor) {
      return res.status(404).json({
        message: "Xóa màu không thành công!",
      });
    }
    return res.status(200).json({
      message: `Xóa màu ${slug} thành công!`,
      DeleteColor,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi máy chủ!",
    });
  }
};
export const updateColor = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const { createdAt, updatedAt, ...rest } = req.body;
  try {
    const { error } = colorUpdateSchema.validate(body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: error.details.map(error => error.message),
      });
    }

    const checkIsChange = await Color.findOne({ ...rest });
    if (checkIsChange) {
      return res.status(400).json({
        message: "Màu sắc k có thay đổi",
      });
    }

    const color_name = body.color_name;
    const slug = slugify(color_name, { lower: true });

    const existingColor = await Color.findById(id);

    if (!existingColor) {
      return res.status(400).json({
        message: "Không tìm thấy color",
      });
    }

    const color = await Color.findByIdAndUpdate(
      id,
      { ...body, slug },
      {
        new: true,
      }
    );

    if (!color) {
      return res.status(400).json({
        message: "Cập nhật màu thất bại",
      });
    }

    return res.status(200).json({
      message: "Cập nhật màu thành công",
      color,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const searchColor = async (req, res) => {
  const {
    _page = 1,
    _sort = "createdAt",
    _limit = 10,
    _order = "asc",
    _color_code = "",
  } = req.query;
  const options = {
    page: _page,
    sort: { [_sort]: _order === "asc" ? -1 : 1 },
    limit: _limit,
  };
  try {
    const searchQuery = _color_code
      ? { color_code: { $regex: _color_code, $options: "i" } }
      : {};
    const colors = await Color.paginate(searchQuery, options);

    if (!colors || colors.docs.length === 0) {
      return res.status(400).json({
        message: "Danh sách màu trống!",
      });
    }

    return res.status(200).json({
      message: "Lấy danh sách màu thành công",
      colors: colors.docs,
      paginattion: {
        currentPage: colors.page,
        totalPages: colors.totalPages,
        totalItems: colors.totalDocs,
        limit: colors.limit,
      },
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
