import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  const files = req.files;
  if (!Array.isArray(files)) {
    return res.status(400).json({ error: "No files were uploaded" });
  }
  try {
    const uploadPromises = files.map((file) => {
      return cloudinary.uploader.upload(file.path, {
        quality: "auto:low",
      });
    });
    const results = await Promise.all(uploadPromises);
    const uploadedFiles = results.map((result) => ({
      url: result.secure_url,
      publicId: result.original_filename,
    }));
    return res.json({ urls: uploadedFiles });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteImage = async (req, res) => {
  const publicId = req.params.publicId;
  try {
    const result = await cloudinary.uploader.destroy(
      `datn_7sportshoes/${publicId}`,
      { invalidate: true }
    );
    if (result.result !== "ok") {
      return res
        .status(200)
        .json({ message: "Xóa ảnh thất bại", result, publicId });
    }
    return res
      .status(200)
      .json({ message: "Xóa ảnh thành công", result, publicId });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error deleting image" });
  }
};

export const updateImage = async (req, res) => {
  const files = req.files;
  if (!Array.isArray(files)) {
    return res.status(400).json({ error: "No files were uploaded" });
  }

  const publicId = req.params.publicId;
  const newImage = req?.files[0]?.path;
  try {
    const [uploadResult, deleteResult] = await Promise.all([
      cloudinary.uploader.upload(newImage),
      cloudinary.uploader.destroy(`datn_7sportshoes/${publicId}`, {
        invalidate: true,
      }),
    ]);
    return res.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.original_filename,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Error updating image" });
  }
};
