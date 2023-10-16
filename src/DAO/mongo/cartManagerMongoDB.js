import CartModel from '../mongo/models/cart.model.js';
import ProductModel from '../mongo/models/products.model.js'
import ProductManager from '../mongo/prouctManagerMongoDB.js';

class cartMngr {
    getCarts = async () => {
        const carts = await CartModel.find({});
        return carts;
    };

    createCart = async () => {
        const newCart = await CartModel.create({ idProducts: [] });
            const idString = newCart._id.toString();

            return idString
    }

    async getById(cId) {
        try {
            const cart = await CartModel.findOne({ _id: cId }).populate('idProducts.idProduct');
            return cart
        } catch (error){
            return error;
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
            // corregir, acceder desde produc.manager desde el metodo find
            //const product = await ProductModel.findOne({ _id: pId });

            const product = await ProductManager.getOne(pId);
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
            console.log(error);
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

const CartManager = new cartMngr();

export default CartManager
