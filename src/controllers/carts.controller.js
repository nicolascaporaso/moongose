import {CartService} from '../services/cart.service.js';

class CartsController{

    async createCart (req, res) {
        try {
            const cart = await CartService.createCart();
            return res.status(201).json({ id: cart });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'error general' })
        }
    };

    async getById(req, res) {
        try {
            const cart = await CartService.getById(req.params.cid);
            res.status(200).json({
                success: true,
                payload: cart.idProducts
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'error GENERAL' });
        }
    };

    async getCarts(req, res) {
        try {
            const carts = await CartService.getCarts(req.query.limit);
            res.status(200).json(carts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'error' })
        }
    };

    async updateCart(req, res) {
        const cId = req.params.cid;
        const cartData = req.body;
        try {
    
            await CartService.updateCart(cId, cartData);
            return res.status(201).json({ message: "product added to cart" });
    
        } catch (error) {
            res.status(500).json({ message: error.message });
            console.error(error);
        }
    };

    async addProductToCart (req, res) {
        try {
            await CartService.addProductToCart(req.params.cid, req.params.pid, req.body.quantity);
            return res.status(201).json({ message: "product added to cart" });
        
        } catch (error) {
            res.status(500).json({ message: error.message });
            console.error(error);
        }
    };

    async removeProductFromCart (req, res) {
        try {
            const cId = req.params.cid
            const pId = req.params.pid
    
            await CartService.removeProductFromCart(cId, pId);
            return res.status(201).json({ message: "product removed from cart" });
        
        } catch (error) {
            res.status(500).json({ message: error.message });
            console.error(error);
        }
    };

    async deleteCart (req, res) {
        try {
            const data= await CartService.deleteCart(req.params.cid);
            return res.status(201).json({ message: "all products removed from cart",  data});
        } catch (error) {
            res.status(500).json({ message: error.message });
            console.error(error);
        }
    };
    
    async getCartActiveSession (req, res) {
    
        try {
            const cartId= req.session.user.cartId;
            return res.status(201).json({ message: "este es el carrito del usuario actual", cartId });
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al obtener el carrito." });
        }
    };

}


export const cartsController = new CartsController();