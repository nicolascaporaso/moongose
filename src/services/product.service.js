import ProductManager from '../DAO/mongo/prouctManagerMongoDB.js';
import CustomError from '../errors/customError.js';
import customErrorMsg from '../errors/customErrorMsg.js';
import EErros from '../errors/enums.js';
import { sendEmailsToDeletedProducts } from '../utils/sendMail.js';
import logger from "../config/logger.js";


class PdctService {


    async isValidEmail(email){
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
        
            if( emailRegex.test(email) ){
                return true;
            }else{
                return false;
            }
    } 
    

    async validateProduct(title, description, code, price, stock) {
        if (!description || !title || !code || !price || !stock) {
            

            return CustomError.createError({
                name: 'Validation Error',
                message: '🛑 Wrong Data Format.',
                code: EErros.INVALID_TYPES_ERROR,
                cause: customErrorMsg.generateProductErrorInfo(title, description, code, price, stock),
            });
        }
    }

    async getAll(page, limit, sort, prenda) {
        page = parseInt(page);
        let order = parseInt(sort);
        let validatedSort = 1;
        const query = {}

        if (order == 1 || order == -1) {
            validatedSort = order;
        }

        if (prenda) {
            query.title = prenda;
        }

        try {
            const queryRes = await ProductManager.getProducts(query, { limit: limit || 10, page: page || 1, sort: { title: validatedSort } });

            return queryRes;

        } catch (error) {
            console.error(error);
        }
    }

    async getOne(id) {
        try {
            const product = await ProductManager.getOne({ _id: id });
            return product;
        } catch (error) {
            console.error(error);
            throw new Error("Ha ocurrido un error al buscar el producto");
        }
    }

    async createOne(title, description, code, price, stock, status, thumbnails, dataUser) {
        try {
            const { email, role } = dataUser;
            let owner;
            // Verificar el rol del propietario
            if (role === 'premium') {
                // Si el propietario es premium, establece el propietario como su email
                owner = email;
            } else if (role === 'admin') {
                // Si el propietario es admin, establece el propietario como "admin"
                owner = 'admin';
            } else {
                // Si el rol del propietario no es ni premium ni admin, devuelve un código de estado 403 (Prohibido)
                throw new Error("No tienes permisos para crear productos.");
            }

            this.validateProduct(description, title, code, price, stock, status);

            const productCreated = await ProductManager.createOne({
                description,
                title,
                code,
                price,
                stock,
                status,
                thumbnails,
                owner,
            });

            return productCreated;
        } catch (error) {
            console.error(error);
            throw new Error("Ha ocurrido un error al crear el producto");
        }
    }

    async deleteOne(id, data) {
        const { role, email } = data;
        try {
            const productToDelete = await this.getOne(id);
            // si el usuario es admin puede borrar cualquier producto, pero avisa por mail.
            if (role === 'admin') {
                const deleted = await ProductManager.deleteOne({ _id: id });
                if (this.isValidEmail(productToDelete.owner)) {
                    // llama funcion para mandar email
                    await sendEmailsToDeletedProducts(productToDelete.owner,id);
                } else {
                    if (!productToDelete.owner === "admin") {
                        throw new Error("email invalido, no se puede enviar correo");
                    }
                }
                return deleted;
            } else if (role === 'premium') {
                // Si el usuario es premium, verifica si el producto le pertenece antes de borrarlo
                if (productToDelete.owner === email) {
                    const deleted = await ProductManager.deleteOne({ _id: id });
                    return deleted;
                } else {
                    // Si el producto no le pertenece, devuelve un código de estado 403 (Prohibido)
                    throw new Error("No tienes permisos para borrar este producto, no te pertenece.");
                }
            } else {
                // Si el rol del usuario no es ni admin ni premium, devuelve un código de estado 403 (Prohibido)
                throw new Error("No tienes permisos para borrar productos.");
            }
        } catch (error) {
            console.error(error);
            throw new Error("Ha ocurrido un error al buscar o borrar el producto");
        }
    }

    async updateOne(id, description, title, code, price, stock, status, thumbnails) {
        price = parseInt(price);
        stock = parseInt(stock);
        if (!id) throw new error("invalid ID");
        this.validateProduct(description, title, code, price, stock, status);
        const productupdate = await ProductManager.updateOne(id, description, title, code, price, stock, status, thumbnails);
        return productupdate;
    }

    async getRealTimeProducts() {
        try {
            const products = await ProductManager.getRealTimeProducts();
            return products;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener los productos');
        }
    }
}

export const ProductService = new PdctService();