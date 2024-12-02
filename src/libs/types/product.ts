import { ObjectId } from "mongoose";
import {
  ProductCollection,
  ProductSize,
  ProductStatus,
  ProductDietaryInfo,
} from "../enums/product.enum";

export interface Product {
  _id: ObjectId;
  productStatus: ProductStatus;
  productCollection: ProductCollection;
  productName: String;
  productPrice: number;
  productLeftCount: number;
  productSize: ProductSize;
  productVolume: number;
  productCalorie: number;
  productDietaryInfo: ProductDietaryInfo;
  productDesc?: string;
  productImages: string[];
  productViews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInquiry {
  order: string;
  page: number;
  limit: number;
  productCollection?: ProductCollection;
  productCalorie?: number;
  productDietaryInfo?: ProductDietaryInfo;
  search?: string;
}

export interface ProductInput {
  productStatus?: ProductStatus;
  productCollection: ProductCollection;
  productName: String;
  productPrice: number;
  productLeftCount: number;
  productSize?: ProductSize;
  productVolume?: number;
  productCalorie?: number;
  productDietaryInfo: String;
  productDesc?: string;
  productImages?: string[];
  productViews?: number;
}

export interface ProductUpdateInput {
  _id: ObjectId;
  productStatus?: ProductStatus;
  productCollection?: ProductCollection;
  productName?: String;
  productPrice?: number;
  productLeftCount?: number;
  productSize?: ProductSize;
  productVolume?: number;
  productCalorie?: number;
  productDietaryInfo: ProductDietaryInfo;
  productDesc?: string;
  productImages?: string[];
  productViews?: number;
}
