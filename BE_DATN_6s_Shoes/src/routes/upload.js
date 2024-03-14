import express from "express";
import multer from "multer";
import { deleteImage, updateImage, uploadImage } from "../controller/upload.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "datn_7sportshoes",
    format: "jpg",
    allowedFormats: ["jpg", "jpeg", "png", "gif"],
  },
});

const upload = multer({ storage: storage });

router.post("/images/upload", upload.array("images", 12), uploadImage);
router.delete("/images/delete/:publicId", deleteImage);
router.put("/images/update/:publicId", upload.array("images", 12), updateImage);

export default router;
