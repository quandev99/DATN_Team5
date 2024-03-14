import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import slug from "mongoose-slug-generator";
var brandSchema = new mongoose.Schema(
  {
    brand_name: {
      type: String,
      unique: true,
      index: true,
    },
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        require: true,
      },
    ],
    categories: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        require: true,
      },
    ],
    brand_image: {
      type: Object,
    },
    brand_is_new: {
      type: Boolean,
      default: true,
    },
    brand_status: {
      type: Boolean,
      default: false,
    },
    brand_description: {
      type: String,
      minLength: 5,
      maxLength: 255,
    },
    brand_default: {
      type: Boolean,
      default: true,
    },
    slug: {
      type: String,
      slug: "brand_name",
    },
  },
  { versionKey: false, timestamps: true }
);
mongoose.plugin(slug);
brandSchema.plugin(mongoosePaginate);
export default mongoose.model("Brand", brandSchema);
