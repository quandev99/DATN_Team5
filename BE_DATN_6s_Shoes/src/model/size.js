import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import slug from "mongoose-slug-generator";

const SizeSchema = new mongoose.Schema(
  {
    size_name: {
      type: String,
      require: true,
      maxLength: 55,
      index: true,
    },
    size_description: {
      type: String,
      maxLength: 255,
    },
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
    ],
    size_is_new: {
      type: Boolean,
      default: true,
    },
    size_code: {
      type: String,
      trim: true,
      maxLength: 55,
    },
    slug: {
      type: String,
      slug: "size_name",
      require: true,
    },
  },
  { versionKey: false, timestamps: true }
);
mongoose.plugin(slug);
SizeSchema.plugin(mongoosePaginate);
export default mongoose.model("Size", SizeSchema);
