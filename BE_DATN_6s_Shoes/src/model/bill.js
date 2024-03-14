import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const billSchema = new mongoose.Schema(
  {
    bill_code: {
      type: String,
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    coupon_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: false,
    },
    payment_status: {
      type: mongoose.Types.ObjectId,
      ref: "Payment_Status",
    },
    pStatus_name: String,
    products: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        variant_product_id: {
          type: mongoose.Schema.Types.ObjectId,
        },
        product_name: { type: String },
        product_price: { type: Number },
        product_discount: { type: Number },
        product_image: { type: Object },
        product_quantity: { type: Number },
        size_id: { type: mongoose.Schema.Types.ObjectId },
        size_name: { type: String },
        color_name: { type: String },
        color_id: { type: mongoose.Schema.Types.ObjectId },
        price: {
          type: Number,
        },
        quantity: {
          type: Number,
        },
      },
    ],
    user_username: String,
    user_email: String,
    user_avatar: {
      type: Object,
      require: true,
      default: {
        url: "https://i.pinimg.com/736x/e0/7a/22/e07a22eafdb803f1f26bf60de2143f7b.jpg",
        publicId: "nbv0jiu0bitjxlxo1bqi",
      },
    },
    status: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid",
    },
    payment_method: {
      type: mongoose.Types.ObjectId,
      ref: "paymentMethod",
    },
    bill_note: {
      type: String,
    },
    bill_totalPrice: {
      type: Number,
      default: 0,
    },
    bill_fullName: {
      type: String,
    },
    bill_totalOrder: {
      type: Number,
      default: 0,
    },
    bill_shippingAddress: {
      type: String,
    },
    bill_shippingFee: {
      type: Number,
      default: 0,
    },
    bill_phone: {
      type: String,
    },
    isReview: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

billSchema.plugin(mongoosePaginate);

export default mongoose.model("Bill", billSchema);
