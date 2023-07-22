//alt shift o
import { log } from "console";
import { CartModel } from "../DAO/models/cart.model.js";
import { ProductModel } from "../DAO/models/products.model.js";
import { pid } from "process";

class CartSrvc {

    async getCarts(limit) {
        const carts = await CartModel.find({});
        if (limit) {
            return carts.slice(0, limit);
        } else {
            return carts;
        }
    };



    createCart = async () => {
        try {
            const newCart = await CartModel.create({ idProducts: [] });
            const idString = newCart._id.toString();
            return idString
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    }

    async getById(cId) {
        try {
            const cart = await CartModel.findOne({ _id: cId }).populate('idProducts.idProduct');
            return cart
        } catch {
            throw error
        }
    }



    deleteCart = async (cId) => {
        try {

            const cart = await CartModel.findOne({ _id: cId });

            if (!cart) {
                throw new Error('Cart not found');
            }
            cart.idProducts = []; // Vaciar la lista de productos del carrito
            return await cart.save();

        } catch (error) {
            if (error.message === "Cart not found") {
                return error
            } else {
                console.log(error);
                throw new Error('unknown error');
            }
        }
    }


    removeProductFromCart = async (cId, pId) => {
        try {
            const cart = await CartModel.findOne({ _id: cId });
            if (!cart) {
                throw new Error('Cart not found');
            }

            const product = await ProductModel.findOne({ _id: pId });
            if (!product) {
                throw new Error('product not found');
            }

            const productCart = cart.idProducts.findIndex(item => item.idProduct.toString() === pId);

            cart.idProducts.splice(productCart, 1);

            await cart.save();

        } catch (error) {
            switch (error.message) {
                case 'Cart not found':
                    throw new Error('Cart not found');
                    break;
                case 'product not found':
                    throw new Error('product not found');
                    break;
                default:
                    res.status(500).json({ message: 'error general' })
                    console.log(error);
            }
        }
    }


    addProductToCart = async (cId, pId, pQuantity) => {
        const quantity = parseInt(pQuantity);

        try {
            const cart = await CartModel.findOne({ _id: cId });
            if (!cart) {
                throw new Error('Cart not found');
            }

            const product = await ProductModel.findOne({ _id: pId });
            if (!product) {
                throw new Error('product not found');
            }

            const productCart = cart.idProducts.findIndex(item => item.idProduct.toString() === pId);

            if (productCart === -1) {
                cart.idProducts.push({
                    idProduct: pId,
                    quantity: quantity
                })
                return await cart.save()

            } else {
                cart.idProducts[productCart].quantity += quantity;
                return await cart.save()
            }
        } catch (error) {
            switch (error.message) {
                case 'Cart not found':
                    throw new Error('Cart not found');
                    //error específico de "Cart not found"
                    break;
                case 'product not found':
                    throw new Error('product not found');
                    // error específico de "Product not found" 
                    break;
                default:
                    throw new Error('error general');
                    console.log(error);
            }
        }
    }


    updateCart = async (cId, cartData) => {
        try {
            const cart = await CartModel.findOne({ _id: cId });

            if (!cart) {
                throw new Error('Cart not found');
            }

            if (Object.keys(cartData).length === 0) {
                throw new Error('empty object');
            } else {
                cart.idProducts = cartData;
            }

            return await cart.save();

        } catch (error) {
            switch (error.message) {
                case 'Cart not found':
                    throw new Error('Cart not found');
                case 'empty object':
                    throw new Error('empty object');
                default:
                    throw "error general";
            }
        }
    }
}

export const CartService = new CartSrvc();