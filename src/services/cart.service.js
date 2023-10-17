//alt shift o

import CartManager from "../DAO/mongo/cartManagerMongoDB.js";

class CartSrvc {

    async getCarts(limit) {
        const carts = await CartManager.getCarts();
        if (limit) {
            return carts.slice(0, limit);
        } else {
            return carts;
        }
    };

    createCart = async () => {
        try {
            const newCartId = await CartManager.createCart();
            return newCartId;
        } catch (error) {
            console.error(error);
            throw new Error();
        }
    }

    async getById(cId) {
        try {
            const cart = await CartManager.getById(cId);
            return cart
        } catch (error) {
            console.error(error);
            throw new Error();
        }
    }

    deleteCart = async (cId) => {
        try {
            const deletedCart = await CartManager.deleteCart(cId);
            return deletedCart
        } catch (error) {
            console.error(error);
            return error.message;
        }
    }


    removeProductFromCart = async (cId, pId) => {
        try {
            await CartManager.removeProductFromCart(cId, pId);
        } catch (error) {
            console.error(error);
            return error.message;
        }
    }


    addProductToCart = async (cId, pId, pQuantity) => {
        try {
            const cart = await CartManager.addProductToCart(cId, pId, pQuantity);
            return cart
        } catch (error) {
            console.error(error);
            return "hubo un error";
        }
    }


    updateCart = async (cId, cartData) => {
        try {
            const cart = await CartManager.updateCart(cId, cartData);
            return cart
        } catch (error) {
            console.error(error);
            return error.message
        }
    }
}

export const CartService = new CartSrvc();