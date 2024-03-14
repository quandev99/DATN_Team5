import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const couponSchema = new mongoose.Schema(
  {
    coupon_name: {
      type: String,
      require: true,
    },
    coupon_code: {
      type: String,
      max: 30,
      index: true,
      require: true,
    },
    coupon_content: {
      type: String,
    },
    coupon_quantity: {
      type: Number,
      require: true,
    },
    discount_amount: {
      type: Number,
      require: true,
    },
    expiration_date: {
      type: Date,
      require: true,
    },
    min_purchase_amount: {
      type: Number,
      require: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    used_by_users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isSpecial: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

couponSchema.plugin(mongoosePaginate);
export default mongoose.model("Coupon", couponSchema);
