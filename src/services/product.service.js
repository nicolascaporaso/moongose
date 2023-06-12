import { error } from "console";
import { ProductModel } from "../DAO/models/products.model.js";
import { query } from "express";
import { type } from "os";

export class ProductService {

    async getAll(params) {
        let page = params.page
        let limit = params.limit
        page = parseInt(page);
        let order = parseInt(params.sort);
        let validatedSort = 1;
        const prenda = params.prenda;
        const query = {}

        if (order == 1 || order == -1) {
            validatedSort = order;
        }
        
        if (prenda){
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
        const product = await ProductModel.findOne({ _id: id });
        return product;
    }

    async validateProduct(description, title, code, price, stock) {
        if (!description || !title || !code || !price || !stock) {
            console.log("validation error: please complete all data.");
            throw new error("validation error: please complete all data.");
        }
    }

    async createOne(description, title, code, price, stock, status, thumbnails) {
        this.validateProduct(description, title, code, price, stock, status);
        const productCreated = await ProductModel.create({ description, title, code, price, stock, status, thumbnails });
        return productCreated;
    }

    async deleteOne(id) {
        const deleted = await ProductModel.deleteOne({ _id: id });
        return deleted;
    }

    async updateOne(id, description, title, code, price, stock, status, thumbnails) {
        if (!id) throw new error("invalid ID");
        this.validateProduct(description, title, code, price, stock, status);
        const productupdate = await ProductModel.updateOne({ _id: id }, { title, description, code, price, stock, status, thumbnails });
        return productupdate;
    }
}
