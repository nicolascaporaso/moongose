import { Router } from "express";
import { uploader } from "../utils.js";
import { ProductService } from "../services/product.service.js";

export const pdctRouter = Router()
const ProductSrvc = new ProductService();


pdctRouter.get("/", async (req, res) => {
    try {
        const productos = await ProductSrvc.getAll(req.query);
        return res.status(200).json({
            status: "success",
            msg: "listado de productos", 
            payload: productos.docs
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });
    }
});

pdctRouter.get("/:pid", async (req, res) => {
    try {
        const producto = await ProductSrvc.getOne(req.params.pid)
        return res.status(200).json({
            status: "success",
            msg: "usuario con id:",
            data: producto,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });
    }
});

pdctRouter.post("/", uploader.single('thumbnails'), async (req, res) => {
    const { title, description, code, price, stock, status } = req.body;
    const thumbnails = "/" + req.file.filename;
    try {
        const productCreated = await ProductSrvc.createOne(title, description, code, price, stock, status, thumbnails)        
        return res.status(201).json({
            status: "success",
            msg: "user created",
            data: productCreated,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'error desconocido' })
    }
});

pdctRouter.put("/:id", uploader.single('thumbnails'), async (req, res) => {
    try {
        const thumbnails = "/" + req.file.filename;
        const id = req.params.id;
        let { title, description, code, price, stock, status, } = req.body;
        price = parseInt(price);
        stock = parseInt(stock);
        const productUpdated = await ProductSrvc.updateOne(id, title, description, code, price, stock, status, thumbnails );
        return res.status(201).json({
            status: "success",
            msg: "user uptaded",
            data: { _id: id, description, title, code, price, stock, status, thumbnails },
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });
    }
});

pdctRouter.delete("/:id", async (req, res) => {
    try {
        const id= req.params.id
        const producto = await ProductSrvc.deleteOne(id)
        return res.status(200).json({
            status: "success",
            msg: "user deleted",
            data: {},
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "something went wrong :(",
            data: {},
        });
    }

});

