import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import slug from "mongoose-slug-generator";
const CategorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      maxlength: 50,
      require: true,
    },
    category_status: {
      type: Boolean,
      default: true,
    },
    category_default: {
      type: Boolean,
      default: true,
    },
    category_is_new: {
      type: Boolean,
      default: true,
    },
    category_image: {
      type: Object,
      require: true,
      default: {
        url: "https://i.pinimg.com/736x/e0/7a/22/e07a22eafdb803f1f26bf60de2143f7b.jpg",
        publicId: "nbv0jiu0bitjxlxo1bqi",
      },
    },
    category_description: {
      type: String,
      minlength: 3,
      maxlength: 255,
    },
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        require: true,
      },
    ],
    brand_id: {
      type: mongoose.Types.ObjectId,
      ref: "Brand",
    },
    slug: {
      type: String,
      slug: "category_name",
    },
  },
  { timestamps: true, versionKey: false }
);
mongoose.plugin(slug);
CategorySchema.plugin(mongoosePaginate);
export default mongoose.model("Category", CategorySchema);
