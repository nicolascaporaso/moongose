import { error } from "console";
import { ProductModel } from "../DAO/models/products.model.js";

export class ProductService {
    
    async getAll() {
        const products = await ProductModel.find({});
        return products;
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
