import mongoose from "mongoose";
import slug from "mongoose-slug-generator";
import mongoosePaginate from "mongoose-paginate-v2";
import MongooseDelete from "mongoose-delete";
const plugins = [mongoosePaginate, MongooseDelete];
const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      maxlength: 55,
      require: true,
    },
    product_code: {
      type: String,
      maxlength: 55,
    },
    product_image: {
      type: Object,
      require: true,
    },
    thumbnail: {
      type: Array,
    },
    product_description_short: {
      type: String,
      maxlength: 255,
    },
    product_description_long: {
      type: String,
      maxlength: 5000,
    },
    product_view: {
      type: Number,
      default: 0,
      require: true,
    },
    product_is_new: {
      type: Boolean,
      default: true,
    },
    slug: {
      type: String,
      slug: "product_name",
      require: true,
    },
    favorite_id: {
      type: mongoose.Types.ObjectId,
      ref: "Favorite",
    },
    group_id: {
      type: mongoose.Types.ObjectId,
      ref: "Product_Group",
    },
    favorite_count: {
      type: Number,
      default: 0,
    },
    category_id: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    sold_quantity: { type: Number, default: 0 },
    variant_products: [
      {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: "Variant_Product",
      },
    ],
    brand_id: {
      type: mongoose.Types.ObjectId,
      ref: "Brand",
    },
    product_status: {
      type: Boolean,
      default: false,
    },
    review_count: { type: Number, default: 0 },
    average_score: { type: Number, default: 0 },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

plugins.forEach((plugin) => {
  productSchema.plugin(plugin, {
    deletedAt: true,
    overrideMethods: true,
  });
});
mongoose.plugin(slug);
export default mongoose.model("Product", productSchema);
