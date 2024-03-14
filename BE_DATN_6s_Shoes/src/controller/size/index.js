import { getAllSizes, getSizeById, getSizeBySlug } from "./get.js";
import { createSize } from "./create.js";
import { updateSize } from "./update.js";
import { deleteSizeById, deleteSizeBySlug } from "./delete.js";

export {
  getAllSizes,
  deleteSizeBySlug,
  deleteSizeById,
  createSize,
  updateSize,
  getSizeById,
  getSizeBySlug,
};
