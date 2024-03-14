import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const variantSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      require: true,
    },
    color_id: {
      type: mongoose.Types.ObjectId,
      ref: "Color",
      require: true,
    },
    size_id: {
      type: mongoose.Types.ObjectId,
      ref: "Size",
      require: true,
    },
    variant_price: {
      type: Number,
      min: 0,
      require: true,
    },
    variant_discount: {
      type: Number,
      min: 0,
      default: 0,
      require: true,
    },
    variant_quantity: {
      type: Number,
      min: 0,
      require: true,
    },
    variant_stock: {
      type: Number,
      min: 0,
      require: true,
    },
  },
  { versionKey: false, timestamps: true }
);
variantSchema.plugin(mongoosePaginate);
export default mongoose.model("Variant_Product", variantSchema);
