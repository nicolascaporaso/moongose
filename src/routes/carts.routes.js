import { Router } from "express";
import CartManager from "../managers/cartManager.js";

const cartManager = new CartManager('./src/data/carts.json');
export const cartRouter = Router()

cartRouter.post("/", async (req, res) => {
    try {
        const product = await cartManager.createCart();
        return res.status(201).json({ mesage: "complete cart creation" });
    } catch (error) {
        if (error.message === "error, reading or writting file") {
            res.status(409).json({ message: "cant create cart" })
        }
        else {
            console.log(error);
            res.status(500).json({ message: 'error desconocido' })
        }
    }
});

cartRouter.get("/", async (req, res) => {
    try {
        const limit = req.query.limit
        const carts = await cartManager.getCarts();
        if (limit) {
            res.status(200).json(carts.slice(0, limit));
        } else {
            res.status(200).json(carts);
        }
    } catch (error) {
        res.status(500).json({ message: 'error' })
    }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cId = req.params.cid
        const pId = req.params.pid
        await cartManager.addProductToCart(cId, pId);
        return res.status(201).json({ message: "product added to cart" });
    } catch (error) {
        if (error.message === "Cart not found") {
            res.status(404).json({ message: "cart not found" });
        } else {
            console.log(error);
            res.status(500).json({ message: "unknown error" });
        }
    }
});


cartRouter.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const cId = req.params.cid
        const pId = req.params.pid
        await cartManager.removeProductFromCart(cId, pId);
        return res.status(201).json({ message: "product removed from cart" });
    } catch (error) {
        if (error.message === "Cart not found") {
            res.status(404).json({ message: "cart not found" });
        } else {
            console.log(error);
            res.status(500).json({ message: "unknown error" });
        }
    }
});
