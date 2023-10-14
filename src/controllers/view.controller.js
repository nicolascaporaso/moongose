import { ProductService } from "../services/product.service.js";
import { CartService } from "../services/cart.service.js";
import UserService from '../services/users.service.js';
import logger from "../config/logger.js";


class ViewsController {

    async viewRealTime(req, res) {
        try {
            const products = await ProductService.getRealTimeProducts();
            return res.status(200).render("realtimeproducts", { products });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
            });
        }
    }

    async getAllProducts(req, res) {
        try {
            const products = await ProductService.getAll(req.query);
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
    }

    async getCartById (req, res) {
        try {
            const cart = await CartService.getById(req.params.cid);
            console.log(cart);
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
    }
    
    async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            let payload = users.map((user) => {
                return {id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role}
            });
            return res.status(200).render("users", { status: "success", users: payload });
        } catch (e) {
            console.error(e);
            return res.status(500).json({
                status: "error",
                message: "Something went wrong :(",
                data: e,
            });
        }
    }
}



export const viewsController = new ViewsController();