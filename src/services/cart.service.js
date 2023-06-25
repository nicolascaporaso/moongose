//alt shift o
import { log } from "console";
import { CartModel } from "../DAO/models/cart.model.js";
import { ProductModel } from "../DAO/models/products.model.js";

export class CartService {

    getCarts = async () => {
        const carts = await CartModel.find({});
        return carts;
    }

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
                throw error
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
                throw error;
            }
        }

        addProductToCart = async (cId, pId, pQuantity) => {
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
                        quantity: pQuantity
                    })
                    return await cart.save()

                } else {
                    cart.idProducts[productCart].quantity += pQuantity;
                    return await cart.save()
                }
            } catch (error) {
                throw error
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
                throw error
            }
        }
    }