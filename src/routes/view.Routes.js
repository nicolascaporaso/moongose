import { Router } from "express";
import { ProductModel } from "../DAO/models/products.model.js";


export const viewRouter = Router()

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