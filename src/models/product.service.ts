import { T } from "../libs/types/common";
import Errors, { Message } from "../libs/Error";
import {
  Product,
  ProductInput,
  ProductInquiry,
  ProductUpdateInput,
} from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { HttpCode } from "../libs/Error";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { ProductStatus } from "../libs/enums/product.enum";
import { ObjectId } from "mongoose";
import ViewService from "./View.service";
import { ViewGroup } from "../libs/enums/view.enum";
import { ViewInput } from "../libs/types/view";

class ProductService {
  private readonly productModel;
  public viewService;

  constructor() {
    this.productModel = ProductModel;
    this.viewService = new ViewService();
  }

  // SPA

  public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
    console.log("inquiry:", inquiry);
    const match: T = { productStatus: ProductStatus.PROCESS };

    if (inquiry.productCollection)
      match.productCollection = inquiry.productCollection; // cleanCoding match outside of aggregate

    if (inquiry.search) {
      match.productName = { $regex: new RegExp(inquiry.search, "i") };
    }

    const sort: T =
      inquiry.order === "productPrice"
        ? { [inquiry.order]: 1 } // productPriceda 0 dan tepaga ( [] bu dynamic key array emas )
        : { [inquiry.order]: -1 }; // qolgan ixtiyoriyda tepadan pastga ( [] bu dynamic key array emas )

    console.log("sort:", sort);

    const result = await this.productModel // schema model orqali chaqirildi
      .aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (inquiry.page * 1 - 1) * inquiry.limit }, // 0 ta doc otqazib yubormasligi kerak
        { $limit: inquiry.limit * 1 }, // 3 ta doc oberr
      ]) // pipeline
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async getProduct(
    memberId: ObjectId | null,
    id: string
  ): Promise<Product> {
    const productId = shapeIntoMongooseObjectId(id);
    let result = await this.productModel
      .findOne({ _id: productId, productStatus: ProductStatus.PROCESS })
      .exec();
    console.log("passseddd heeerrreeee1");

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    console.log("passseddd heeerrreeee2");
    if (memberId) {
      // Check Existence
      const input: ViewInput = {
        memberId: memberId,
        viewRefId: productId,
        viewGroup: ViewGroup.PRODUCT,
      };
      const existView = await this.viewService.checkViewExistence(input);
      console.log("existView:", !!existView);
      console.log("passseddd heeerrreeee3");

      if (!existView) {
        // Insert View
        console.log("Planning to insert new view");
        await this.viewService.insertMemberView(input);
        console.log("passseddd heeerrreeee4");

        // Increase Counts
        result = await this.productModel
          .findByIdAndUpdate(
            productId,
            { $inc: { productViews: +1 } },
            { new: true }
          )
          .exec();
        console.log("passseddd heeerrreeee5");
      }
    }
    return result;
  }

  // SSR

  public async getAllProducts(): Promise<Product[]> {
    const result = await this.productModel.find().exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    // console.log("result:", result);
    return result;
  }

  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      console.log("++", input);

      const result = await this.productModel.create(input);
      console.log("result:", result);
      return result;
    } catch (err) {
      console.error("Error, model:createNewProduct:", err);

      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async updateChosenProduct(
    id: string,
    input: ProductUpdateInput
  ): Promise<Product> {
    id = shapeIntoMongooseObjectId(id);
    const result = await this.productModel
      .findOneAndUpdate({ _id: id }, input, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.UPDATE_FAILED);
    console.log("result:", result);
    return result;
  }

  public async getSearchProduct(input: string): Promise<Product[]> {
    const result = await this.productModel
      .find({
        productName: { $regex: new RegExp(input, "i") },
      })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }
}

export default ProductService;
