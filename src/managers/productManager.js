import { promises as fs } from "fs";
import SyncFs from "fs";


class ProductManager {

    constructor(path) {
        this.path = path;
    }

    writeProducts = async (data) => {
        await fs.writeFile(this.path, JSON.stringify(data, null, 2));
    }


    existProduct = async (id) => {
        let answer = await this.getProducts();
        let filter = answer.find((product) => product.id === id);
        return filter;
    }

    addProduct = async (product) => {
        if (!product.title || !product.description || !product.price || !product.code || !product.stock) {
            throw new Error("data is missing");
        }else if (product.id){
            throw new Error("ID is being sent");
        }
        const products = await this.getProducts();
        if (products.some((element) => element.code === product.code)) {
            throw new Error("duplicate code");
        } else {
            product = { id: (Math.random() * 100000000000).toFixed(0), ...product };
            product.status = 'true'
            product.price = parseInt(product.price);
            product.stock = parseInt(product.stock);
            products.push(product);
            const productString = JSON.stringify(products, null, 2)
            await fs.writeFile(this.path, productString);
            return product;
        }
    }

    getProducts = async () => {
        if (!SyncFs.existsSync(this.path)) {
            return [];
        } else {
            let answer = await fs.readFile(this.path, "utf-8");
            return JSON.parse(answer);
        }
    }

    
    getProductById = async (id) => {
        let answer = await this.getProducts();
        let filter = answer.find((product) => product.id === id);
        if (!filter) {
            throw new Error ("Product not found");
        } else {
            return filter;
        }
    }


    deleteProduct = async (id) => {
        const products = await this.getProducts();
        let productToDelete = products.find((product) => product.id === id);
        if (!productToDelete) {
            throw new Error("Product not found");
        } else {
            let productFilter = products.filter(products => products.id !== id);
            const productString= JSON.stringify(productFilter,null,2);
            await fs.writeFile(this.path, productString);
            return "Producto Borrado";
        }
    }


    updateProduct = async (id, updateData) => {
        const products = await this.getProducts();
        const productIndex = products.findIndex(product => product.id == id);
        if (productIndex !== -1) {
            if (!products.some((element) => element.code === updateData.code)) {
                products[productIndex] = { ...products[productIndex], ...updateData };
                const productString = JSON.stringify(products, null, 2)
                await fs.writeFile(this.path, productString);
            } else {
                throw new Error(`Duplicate code product`);
            }
        } else {
            throw new Error(`Product not found with id`);
        }
    }
}

export default ProductManager;

