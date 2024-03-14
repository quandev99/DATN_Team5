import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const NewsSchema = new mongoose.Schema(
  {
    news_content: {
      type: String,
      min: 1,
      max: 5000,
      require: true,
    },
    news_title: {
      type: String,
      default: "",
    },
    news_image: {
      type: Object,
      required: true,
      default: {
        url: "https://i.pinimg.com/736x/e0/7a/22/e07a22eafdb803f1f26bf60de2143f7b.jpg",
        publicId: "nbv0jiu0bitjxlxo1bqi",
      },
    },
    product_id: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: "Product",
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: "User",
    },
    user_fullname: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    news_view: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

NewsSchema.plugin(mongoosePaginate);
export default mongoose.model("News", NewsSchema);
