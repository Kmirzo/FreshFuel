import mongoose, { Schema } from "mongoose";
import {
  ProductDietaryInfo,
  ProductCollection,
  ProductSize,
  ProductStatus,
  ProductVolume,
} from "../libs/enums/product.enum";

const productSchema = new Schema(
  {
    productStatus: {
      type: String,
      enum: ProductStatus,
      default: ProductStatus.PAUSE,
    },
    productCollection: {
      type: String,
      enum: ProductCollection,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productLeftCount: {
      type: Number,
      required: true,
    },
    productSize: {
      type: String,
      enum: ProductSize,
      default: ProductSize.NORMAL,
    },
    productVolume: {
      type: Number,
      enum: ProductVolume,
      default: ProductVolume.ONE,
    },
    productDesc: {
      type: String,
    },
    productImages: {
      type: [String],
      default: [],
    },
    productViews: {
      type: Number,
      default: 0,
    },
    productCalorie: {
      type: Number,
      required: true,
    },
    productDietaryInfo: {
      type: String,
      enum: ProductDietaryInfo,
      required: true,
    },
  },
  { timestamps: true } //UpdatedAt , CreatedAt
);

productSchema.index(
  { productSize: 1, productName: 1, productVolume: 1 },
  { unique: true }
);
export default mongoose.model("Product", productSchema);
