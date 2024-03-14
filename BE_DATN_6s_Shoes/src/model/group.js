import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const groupSchema = new mongoose.Schema(
  {
    group_name: {
      type: String,
      require: true,
    },
    group_description: {
      type: String,
    },
    group_background: {
      type: Object,
      require: true,
    },
    group_link: {
      type: String,
      require: true,
    },
    start_date: {
      type: Date,
      require: true,
    },
    end_date: {
      type: Date,
      require: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    key: {
      type: Number,
    },
    order_sort: {
      type: Number,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

groupSchema.plugin(mongoosePaginate);
export default mongoose.model("Product_Group", groupSchema);
