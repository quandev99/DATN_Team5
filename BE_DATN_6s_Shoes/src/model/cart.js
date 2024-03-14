import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import slug from "mongoose-slug-generator";
const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },
    coupon_id: {
      type: mongoose.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    products: [
      {
        variant_product_id: {
          type: String,
          ref: "Variant_Product",
        },
        product_id: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
        product_name: {
          type: String,
        },
        product_image: {
          type: Object,
        },
        product_quantity: {
          type: Number,
        },
        size_id: {
          type: mongoose.Types.ObjectId,
        },
        color_id: {
          type: mongoose.Types.ObjectId,
        },
        size_name: { type: String },
        color_name: { type: String },
        quantity: {
          type: Number,
          default: 1,
        },
        product_price: {
          type: Number,
        },
        product_discount: {
          type: Number,
        },
        price: {
          type: Number,
        },
      },
    ],
    cart_totalPrice: {
      type: Number,
      default: 0,
    },
    // cart_couponPrice: {
    //   type: Number,
    //   default: 0,
    // },
    cart_totalOrder: {
      type: Number,
      default: 0,
    },
    shippingFee: { type: Number },
  },
  { timestamps: true, versionKey: false }
);
mongoose.plugin(slug);
cartSchema.plugin(mongoosePaginate);
export default mongoose.model("Cart", cartSchema);
