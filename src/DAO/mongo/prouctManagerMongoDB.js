import ProductModel from '../mongo/models/products.model.js'

class PdctManager {

    getProducts = (query, data) => {
        try {
            const products = ProductModel.paginate(query, data);
            return products;
        } catch (error) {
            return error;
        }
    }

    async getOne(id) {
        try {
            const product = await ProductModel.findOne({ _id: id });
            return product;
        } catch (error) {
            return error;
        }
    }

    async createOne(data) {
        try {
            const product = await ProductModel.create(data);
            return product;
        } catch (error) {
            return error;
        }
    }

    async deleteOne(id) {
        const deleted = await ProductModel.deleteOne({ _id: id });
        return deleted;
    }

    async updateOne(id, description, title, code, price, stock, status, thumbnails) {
        const productupdate = await ProductModel.updateOne({ _id: id }, { title, description, code, price, stock, status, thumbnails });
        return productupdate;
    }

    async getRealTimeProducts() {
        const products = await ProductModel.find({}).lean();
        return products;
    }
}

const ProductManager = new PdctManager();
export default ProductManager
