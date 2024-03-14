import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const reviewSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    user_fullname: {
      type: String,
      maxlength: 55,
    },
    user_username: {
      type: String,
      maxlength: 55,
    },
    bill_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bill",
    },
    review_rating: {
      type: Number,
    },
    review_content: {
      type: String,
      maxlength: 255,
    },
    review_image: {
      type: Array,
    },
  },
  { timestamps: true, versionKey: false }
);
reviewSchema.plugin(mongoosePaginate);
export default mongoose.model("Review", reviewSchema);
