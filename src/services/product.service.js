import ProductManager from '../DAO/mongo/prouctManagerMongoDB.js';

class PdctService {

    async validateProduct(title, description, code, price, stock) {
        if (!description || !title || !code || !price || !stock) {
            console.log("validation error: please complete all data.");
            throw new error("validation error: please complete all data.");
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
            console.log(error);
        }
    }

    async getOne(id) {
        try {
            const product = await ProductManager.getOne({ _id: id });
            return product;
        } catch (error) {
            console.log(error);
            throw new Error("Ha ocurrido un error al buscar el producto");
        }
    }

    async createOne(title, description, code, price, stock, status, thumbnails) {
        try {
            this.validateProduct(description, title, code, price, stock, status);

            const productCreated = await ProductManager.createOne({
                description,
                title,
                code,
                price,
                stock,
                status,
                thumbnails,
            });

            return productCreated;
        } catch (error) {
            console.log(error);
            throw new Error("Ha ocurrido un error al crear el producto");
        }
    }

    async deleteOne(id) {
        const deleted = await ProductManager.deleteOne({ _id: id });
        return deleted;
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