import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import slug from "mongoose-slug-generator";
const roleSchema = new mongoose.Schema(
  {
    role_name: {
      type: String,
      maxlength: 50,
      require: true,
    },
    role_status: {
      type: Boolean,
      default: true,
    },
    role_default: {
      type: Boolean,
      default: true,
    },
    role_is_new: {
      type: Boolean,
      default: true,
    },
    role_description: {
      type: String,
      maxlength: 255,
    },
    users: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
        require: true,
      },
    ],
    slug: {
      type: String,
      slug: "role_name",
    },
  },
  { timestamps: true, versionKey: false }
);
mongoose.plugin(slug);
roleSchema.plugin(mongoosePaginate);
export default mongoose.model("Role", roleSchema);
