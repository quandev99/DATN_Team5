import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const pStatusSchema = new mongoose.Schema(
  {
    pStatus_name: {
      type: String,
      min: 3,
      max: 55,
      require: true,
    },
    pStatus_description: {
      type: String,
      min: 3,
      max: 255,
    },
    pStatus_reason: {
      type: String,
      max: 255,
      require: true,
    },
    order_sort: {
      type: Number,
    },
    status: {
      type: Boolean,
      default: false,
      require: true,
    },
  },
  { timestamps: true, versionKey: false }
);

pStatusSchema.plugin(mongoosePaginate);
export default mongoose.model("Payment_Status", pStatusSchema);
