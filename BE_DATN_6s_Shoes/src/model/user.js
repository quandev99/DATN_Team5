import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import slug from "mongoose-slug-generator";
const userSchema = new mongoose.Schema(
  {
    user_fullname: {
      type: String,
      require: true,
      maxlength: 55,
    },
    user_username: {
      type: String,
      require: true,
      maxlength: 55,
    },
    user_email: {
      type: String,
      require: true,
      unique: true,
    },
    user_avatar: {
      type: Object,
      require: true,
    },
    user_phone: {
      type: String,
    },
    user_address: {
      type: String,
    },
    verifyToken: {
      type: Object,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    user_password: {
      type: String,
      minlength: 6,
    },
    user_confirmPassword: {
      type: String,
      minlength: 6,
    },
    user_gender: {
      type: String,
      require: true,
      default: "Khác",
    },
    user_status: {
      type: Boolean,
      default: true,
    },
    user_date_of_birth: {
      type: Date,
    },
    role_id: {
      type: mongoose.Types.ObjectId,
      ref: "Role",
      require: true,
    },
    favorite_id: {
      type: mongoose.Types.ObjectId,
      ref: "Favorite",
      require: true,
    },
    cart_id: {
      type: mongoose.Types.ObjectId,
      ref: "Cart",
      require: true,
    },
    slug: {
      type: String,
      slug: "user_username",
    },
    bills: [{ bill_id: { type: mongoose.Schema.Types.ObjectId, ref: "Bill" } }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, versionKey: false }
);
mongoose.plugin(slug);
userSchema.plugin(mongoosePaginate);
export default mongoose.model("User", userSchema);
