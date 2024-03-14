import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const BannerSchema = new mongoose.Schema(
  {
    banner_image: {
      type: Object,
    },
    banner_link: {
      type: String,
    },
    display_order: {
      type: Number,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

BannerSchema.plugin(mongoosePaginate);
export default mongoose.model("Banner", BannerSchema);
