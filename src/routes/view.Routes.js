import { Router } from "express";
import { ProductModel } from "../DAO/models/products.model.js";
import { ProductService } from "../services/product.service.js";

export const viewRouter = Router()
const ProductSrvc = new ProductService();

viewRouter.get("/", async (req, res) => {
    try {
        const products = await ProductModel.find({}).lean();
        return res.status(200).render("index", { products });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });
    }
});

viewRouter.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await ProductModel.find({}).lean();
        return res.status(200).render("realtimeproducts", { products });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });
    }
});

viewRouter.get("/products", async (req, res) => {
    try {
        const products = await ProductSrvc.getAll(req.query);
        const { docs, ...rest } = products;
            let payload = docs.map((doc) => {
                return { title: doc.title, description: doc.description, code: doc.code, price: doc.price, stock: doc.stock, thumbnails: doc.thumbnails, _id: doc._id }
            });

        return res.status(200).render("index", { status: "succes", payload, pagination: rest });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });
    }
});

viewRouter.get("/carts/:cid", async (req, res) => {
    try {
        const products = await ProductModel.find({}).lean();
        return res.status(200).render("carts", {carts});
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });
    }
});