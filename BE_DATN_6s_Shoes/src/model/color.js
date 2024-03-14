import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import slug from "mongoose-slug-generator";
const ColorSchema = new mongoose.Schema(
  {
    color_name: {
      type: String,
      maxlength: 50,
    },
    color_code: {
      type: String,
      maxlength: 50,
    },
    color_is_new: {
      type: Boolean,
      default: true,
    },
    color_image: {
      type: Object,
      require: true,
      default: {
        url: "https://i.pinimg.com/736x/e0/7a/22/e07a22eafdb803f1f26bf60de2143f7b.jpg",
        publicId: "nbv0jiu0bitjxlxo1bqi",
      },
    },
    color_description: {
      type: String,
      maxlength: 255,
    },
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
    ],
    color_status: {
      type: Boolean,
      default: true,
    },
    slug: {
      type: String,
      slug: "color_name",
    },
  },
  { timestamps: true, versionKey: false }
);
mongoose.plugin(slug);
ColorSchema.plugin(mongoosePaginate);
export default mongoose.model("Color", ColorSchema);
