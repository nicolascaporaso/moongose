import { Router } from "express";
import ProductManager from "../managers/productManager.js";
import { uploader } from "../utils.js";


const myManager = new ProductManager('./src/data/products.json');
export const pdctRouter = Router()

pdctRouter.get("/", async (req, res) => {
    try {
        const limit = req.query.limit
        const products = await myManager.getProducts();
        if (limit) {
            res.status(200).json(products.slice(0, limit));
        } else {
            res.status(200).json(products);
        }
    } catch (error) {
        res.status(500).json({ message: 'error' })
    }
});

pdctRouter.get("/:pid", async (req, res) => {
    try {
        const id = (req.params.pid);
        const product = await myManager.getProductById(id);
        if (product) {
            res.status(200).json(product);
        }
    } catch (error) {
        if (error.message === "Product not found") {
            res.status(404).json({ message: "Product not found" })
        } else {
            console.log(error);
            res.status(500).json({ message: 'error' })
        }
    }
});

pdctRouter.post("/", uploader.single('thumbnails'), async (req, res) => {
    const newProduct = req.body;
    newProduct.thumbnails ="http://localhost:8080/" + req.file.filename;
    console.log(newProduct);
    try {
        const product = await myManager.addProduct(newProduct);
        return res.status(201).json(product);
    } catch (error) {
        if (error.message === "duplicate code") {
            res.status(409).json({ message: "error, duplicate code" })
        }
        else if (error.message === "ID is being sent") {
            res.status(409).json({ message: "problems with ID" })

        }
        else if (error.message === "data is missing") {
            res.status(404).json({ message: "At least one piece of data is missing" })

        } else {
            console.log(error);
            res.status(500).json({ message: 'error desconocido' })
        }
    }
});

pdctRouter.put("/:id", async (req, res) => {
    try {
        const newProduct = req.body;
        if (newProduct.id) {
            return res.status(400).json({ error: "data incorrect, se intenta modificar id", });
        }
        const id = req.params.id;
        const product = await myManager.updateProduct(id, newProduct);
        return res.status(201).json({ mesage: "complete update ok" });
    } catch (error) {
        if (error.message === "Duplicate code product") {
            res.status(409).json({ message: "error, duplicate code" })
        }
        else if (error.message === "Product not found with id") {
            res.status(404).json({ message: "error, product no found" })

        } else {
            console.log(error);
            res.status(500).json({ message: 'error desconocido' })
        }
    }

});

pdctRouter.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await myManager.deleteProduct(id);
        return res.status(200).json({ message: 'producto borrado' })
    } catch (error) {
        if (error.message === "Product not found") {
            return res.status(404).json({ message: "Product not found, can't delete." })
        } else {
            return res.status(500).json({ message: 'error interno' });
        }
    }
});

