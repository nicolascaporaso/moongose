import { Router } from "express";
import { CartService } from '../services/cart.service.js';
import { log } from "console";


export const cartRouter = Router()
const cartSrvc = new CartService();
cartRouter.post("/", async (req, res) => {
    try {
        const cart = await cartSrvc.createCart();
        return res.status(201).json({id: cart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'error general' })
    }
});

cartRouter.get("/:cid", async (req, res) => {
    try {
        //const limit = req.query.limit
        console.log(req.params.cid);
        const cart = await cartSrvc.getById(req.params.cid);
        console.log(cart);
        res.status(200).json({
            success: true,
            payload: cart.idProducts});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'error GENERAL' });
    }
});

cartRouter.get("/", async (req, res) => {
    try {
        const limit = req.query.limit
        const carts = await cartSrvc.getCarts();
        if (limit) {
            res.status(200).json(carts.slice(0, limit));
        } else {
            res.status(200).json(carts);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'error' })
    }
});


cartRouter.put("/:cid", async (req, res) => {
    const cId = req.params.cid;
    const cartData = req.body;
    try {

        await cartSrvc.updateCart(cId, cartData);
        return res.status(201).json({ message: "product added to cart" });

    } catch (error) {
        switch (error.message) {
            case 'Cart not found':
                res.status(404).json('Cart not found');
                console.log('Cart not found');
                //error específico de "Cart not found"
                break;
            case 'empty object':
                res.status(400).json('Data not sent');
                console.log('Data not sent');
                // error específico de "Product not found" 
                break;
            default:
                res.status(500).json({ message: 'error general' })
                console.log(error);
        }
    }
});



cartRouter.put("/:cid/product/:pid", async (req, res) => {
    try {
        const cId = req.params.cid;
        const pId = req.params.pid;
        const quantity = parseInt(req.body.quantity);
        await cartSrvc.addProductToCart(cId, pId, quantity);
        return res.status(201).json({ message: "product added to cart" });
    } catch (error) {
        switch (error.message) {
            case 'Cart not found':
                res.status(404).json('Cart not found');
                console.log('Cart not found');
                //error específico de "Cart not found"
                break;
            case 'product not found':
                res.status(404).json('product not found');
                console.log('product not found');
                // error específico de "Product not found" 
                break;
            default:
                res.status(500).json({ message: 'error general' })
                console.log(error);
        }
    }
});


cartRouter.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const cId = req.params.cid
        const pId = req.params.pid

        await cartSrvc.removeProductFromCart(cId, pId);
        return res.status(201).json({ message: "product removed from cart" });
    } catch (error) {
        if (error.message === "Cart not found") {
            res.status(404).json({ message: "cart not found" });
        } else {
            console.log(error);
            switch (error.message) {
                case 'Cart not found':
                    res.status(404).json('Cart not found');
                    console.log('Cart not found');
                    //error específico de "Cart not found"
                    break;
                case 'product not found':
                    res.status(404).json('product not found');
                    console.log('product not found');
                    // error específico de "Product not found" 
                    break;
                default:
                    res.status(500).json({ message: 'error general' })
                    console.log(error);
            }
        }
    }
});

cartRouter.delete("/:cid", async (req, res) => {
    try {
        const cId = req.params.cid
        await cartSrvc.deleteCart(cId);
        return res.status(201).json({ message: "all products removed from cart" });
    } catch (error) {
        if (error.message === "Cart not found") {
            res.status(404).json({ message: "cart not found" });
        } else {
            console.log(error);
            res.status(500).json({ message: "unknown error" });
        }
    }
});

