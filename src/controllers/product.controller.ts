import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Error";
import { T } from "../libs/types/common";
import { ProductInput, ProductInquiry } from "../libs/types/product";
import { AdminRequest, ExtendedRequest } from "../libs/types/member";
import { ProductCollection } from "../libs/enums/product.enum";
import ProductService from "../models/product.service";

const productService = new ProductService();

const productController: T = {};

// SPA:

productController.getProducts = async (req: Request, res: Response) => {
  try {
    console.log("getProducts");
    const { page, limit, order, productCollection, search } = req.query; //requestni ichidan querylarni qabul qilish
    console.log("getProducts", req.query);
    const inquiry: ProductInquiry = {
      order: String(order),
      page: Number(page),
      limit: Number(limit),
    };
    if (productCollection)
      inquiry.productCollection = productCollection as ProductCollection;
    if (search) inquiry.search = String(search);

    const result = await productService.getProducts(inquiry);

    // const query = req.query;  // url nPoint orqali frontenddan backendga data yuborish (query usuli)
    // console.log("req.query:", query);

    // const params = req.params;
    // console.log("req.params:", params);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("ERROR, getProducts:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

productController.getProduct = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getProduct");
    const { id } = req.params; // routerda id deb nom berganmiz xohlagan nom berish mn
    console.log("req.member:", req.member);

    const memberId = req.member?._id ?? null,
      result = await productService.getProduct(memberId, id);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("ERROR, getProduct:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// SSR:

productController.getAllProducts = async (req: Request, res: Response) => {
  try {
    console.log("getAllProducts");
    // console.log("req.member:", req.member);
    const data = await productService.getAllProducts();

    res.render("products", { products: data });
  } catch (err) {
    console.log("ERROR, getAllProducts:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

productController.createNewProduct = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    console.log("createNewProduct");
    console.log("req.files:", req.files);
    console.log("req.body:", req.body);

    if (!req.files?.length)
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

    const data: ProductInput = req.body;
    data.productImages = req.files?.map((ele) => {
      return ele.path;
    });

    //console.log("data:", data);

    await productService.createNewProduct(data);
    res.send(
      `<script>  alert ("Successfull creation"); window.location.replace('/admin/product/all')</script>`
    );
    console.log("data1:", data);
  } catch (err) {
    console.log("ERROR, createNewProduct:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script>  alert ("${message} "); window.location.replace('/admin/product/all')</script>`
    );
    // if (err instanceof Errors) res.status(err.code).json(err);
    // else res.status(Errors.standard.code).json(Errors.standard);
  }
};

productController.updateChosenProduct = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenProduct");
    const id = req.params.id;

    const result = await productService.updateChosenProduct(id, req.body);

    // console.log("ID:", id);
    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("ERROR, updateChosenProduct:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

productController.getSearchProduct = async (req: Request, res: Response) => {
  try {
    console.log("getSearchProduct");

    const products = await productService.getSearchProduct(req.body.search);

    res.render("products", { products });
  } catch (err) {
    console.log("getSearchProduct:", err);
    res.send(
      `<script>  alert ("${err} "); window.location.replace('/admin/product/all')</script>`
    );
  }
};

export default productController;
