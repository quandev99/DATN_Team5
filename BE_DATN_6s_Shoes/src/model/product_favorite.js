import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

var productFavoriteSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        require: true,
      },
    ],
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },
    favorite_is_new: {
      type: Boolean,
      default: true,
    },
  },
  { versionKey: false, timestamps: true }
);

productFavoriteSchema.plugin(mongoosePaginate);
export default mongoose.model("Favorite", productFavoriteSchema);
