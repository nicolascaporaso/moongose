import { error } from "console";
import { ProductModel } from "../DAO/models/products.model.js";
import { query } from "express";
import { type } from "os";

class PdctService {

    async validateProduct(description, title, code, price, stock) {
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
            const queryRes = await ProductModel.paginate(query, { limit: limit || 10, page: page || 1, sort: { title: validatedSort } });

            return queryRes;

        } catch (error) {
            console.log(error);
        }
    }

    async getOne(id) {
        try {
            const product = await ProductModel.findOne({ _id: id });
            return product;
        } catch (error) {
            console.log(error);
            throw new Error("Ha ocurrido un error al buscar el producto");
        }
    }

    async createOne(description, title, code, price, stock, status, thumbnails) {
        try {
            this.validateProduct(description, title, code, price, stock, status);

            const productCreated = await ProductModel.create({
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
        const deleted = await ProductModel.deleteOne({ _id: id });
        return deleted;
    }

    async updateOne(id, description, title, code, price, stock, status, thumbnails) {
        price = parseInt(price);
        stock = parseInt(stock);
        if (!id) throw new error("invalid ID");
        this.validateProduct(description, title, code, price, stock, status);
        const productupdate = await ProductModel.updateOne({ _id: id }, { title, description, code, price, stock, status, thumbnails });
        return productupdate;
    }

    async getRealTimeProducts() {
        try {
            const products = await ProductModel.find({}).lean();
            return products;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener los productos');
        }
    }
}

export const ProductService = new PdctService();