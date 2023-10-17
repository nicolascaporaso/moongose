import { promises as fs } from "fs";
import SyncFs from "fs";


class CartMngr {

    constructor(path) {
        this.path = path;
    }

    getCarts = async () => {
        if (!SyncFs.existsSync(this.path)) {
            return [];
        } else {
            let answer = await fs.readFile(this.path, "utf-8");
            return JSON.parse(answer);
        }
    }

    createCart = async () => {
        try {
            const carts = await this.getCarts();
            const id = (Math.random() * 10000000000000000000).toFixed(0);
            const newCart = { id: id, products: [{ id: "", quantity: "" }] };
            carts.push(newCart);
            const cartsString = JSON.stringify(carts, null, 2)
            await fs.writeFile(this.path, cartsString);
            return id;
        } catch (error) {
            console.error(error);
            throw new Error("error, reading or writting file");
        }
    }

    getCartById = async (cartId) => {
        try {
            const carts = await this.getCarts(); // Obtenemos todos los carritos disponibles usando el método getCarts.
            const cart = carts.find((cart) => cart._id === cartId); // Buscamos el carrito con el ID específico.
    
            if (cart) {
                return cart;
            } else {
                throw new Error("Cart not found."); // Lanzamos un error si el carrito no se encuentra.
            }
        } catch (error) {
            console.error(error);
            throw new Error("Error retrieving cart by ID."); // Lanzamos un error si ocurre algún problema.
        }
    }


    deleteCart = async (cId) => {
        try {
            let carritos = await this.getCarts();
            const indiceCarrito = carritos.findIndex(carrito => carrito.id === cId);
            if (indiceCarrito === -1) {
                throw new Error('Carrito no encontrado');
            }

            // Eliminamos el carrito completamente
            const carritoEliminado = carritos.splice(indiceCarrito, 1)[0];

            const carritosString = JSON.stringify(carritos, null, 2);
            await fs.writeFile(this.path, carritosString);

            return carritoEliminado; // Devolvemos el carrito eliminado
        } catch (error) {
            console.error(error);
            throw new Error('Error general');
        }
    }

removeProductFromCart = async (cId, pId) => {
    try {
        let carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cId);
        if (cartIndex === -1) {
            throw new Error('Cart not found');
        }
        const productIndex = carts[cartIndex].products.findIndex(product => product.id === pId);
        if (productIndex === -1) {
            throw new Error('Product not found');
        }
        if (carts[cartIndex].products[productIndex].quantity === 0) {
            carts[cartIndex].products.splice(productIndex, 1);
        } else {
            carts[cartIndex].products[productIndex].quantity--;
        }
        const cartsString = JSON.stringify(carts, null, 2);
        await fs.writeFile(this.path, cartsString);
    } catch (error) {
            console.error(error);
            throw new Error('General error');
        }
    }
}

addProductToCart = async (cId, pId, quantity) => {
    try {
        if (quantity <= 0) {
            throw new Error('La cantidad debe ser mayor que 0');
        }

        let carritos = await this.getCarts();
        const indiceCarrito = carritos.findIndex(cart => cart.id === cId);
        if (indiceCarrito === -1) {
            throw new Error('Carrito no encontrado');
        }

        const cart = carritos[indiceCarrito];
        const productIndex = cart.products.findIndex(product => product.id === pId);
        if (productIndex === -1) {
            // Si el producto no existe en el carrito, lo agregamos con la cantidad especificada.
            cart.products.push({ id: pId, quantity });
        } else {
            // Si el producto ya existe en el carrito, sumamos la cantidad especificada a la cantidad actual.
            cart.products[productIndex].quantity += quantity;
        }

        const carritosString = JSON.stringify(carritos, null, 2);
        await fs.writeFile(this.path, carritosString);

        return cart; // Devolvemos el carrito actualizado con el producto agregado
    } catch (error) {
        console.error(error);
        throw new Error('Error general');
    }
}

updateCart = async (cId, cartData) => {
    try {
        let carritos = await this.getCarts();
        const indiceCarrito = carritos.findIndex(cart => cart.id === cId);
        if (indiceCarrito === -1) {
            throw new Error('Carrito no encontrado');
        }

        const cartToUpdate = carritos[indiceCarrito];
        // Actualizamos los datos del carrito con los proporcionados en cartData
        Object.assign(cartToUpdate, cartData);

        const carritosString = JSON.stringify(carritos, null, 2);
        await fs.writeFile(this.path, carritosString);

        return cartToUpdate; // Devolvemos el carrito actualizado
    } catch (error) {
        console.error(error);
        throw new Error('Error general');
    }
}

export const CartManager = new CartMngr();
