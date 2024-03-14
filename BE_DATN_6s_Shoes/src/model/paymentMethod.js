import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema(
  {
    pMethod_name: {
      type: String,
      require: true,
    },
    pMethod_description: {
      type: String,
      max: 100,
    },
    pMethod_image: {
      type: Object,
      require: true,
      default: {
        url: "https://i.pinimg.com/736x/e0/7a/22/e07a22eafdb803f1f26bf60de2143f7b.jpg",
        publicId: "nbv0jiu0bitjxlxo1bqi",
      },
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("paymentMethod", paymentMethodSchema);
