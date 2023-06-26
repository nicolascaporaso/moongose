import { Router } from "express";
import { ProductModel } from "../DAO/models/products.model.js";
import { ProductService } from "../services/product.service.js";
import { CartService } from '../services/cart.service.js';
import { isAdmin, isUser } from '../middlewares/auth.js';


export const viewRouter = Router()
const ProductSrvc = new ProductService();
const CartSrvc = new CartService();


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

viewRouter.get("/products", isUser, async (req, res) => {
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

viewRouter.get("/cart/:cid", isUser, async (req, res) => {
    try {
        const cart = await CartSrvc.getById(req.params.cid);
        const formattedData = {
            payload: cart.idProducts.map(item => {
                return {
                    id: item.idProduct._id,
                    cid: req.params.cid,
                    description: item.idProduct.title,
                    title: item.idProduct.description,
                    thumbnails: item.idProduct.thumbnails,
                    quantity: item.quantity
                };
            })
        };
        return res.status(200).render("cart", { formattedData });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });
    }
});