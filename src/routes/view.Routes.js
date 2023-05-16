import { Router } from "express";
import ProductManager from "../managers/productManager.js";

export const viewRouter = Router()
const myManager = new ProductManager('./src/data/products.json');

viewRouter.get("/", async (req, res) => {
    try {
        const products = await myManager.getProducts();
        return res.status(200).render("index", {products});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'error' })
    }
});

viewRouter.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await myManager.getProducts();
        return res.status(200).render("realtimeproducts", {products});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'error' })
    }
});