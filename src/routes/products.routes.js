import { Router } from "express";
import { uploader } from "../utils.js";
import {productsController} from "../controllers/products.controller.js";

export const pdctRouter = Router()


pdctRouter.get('/', productsController.getAll);

pdctRouter.get("/:pid", productsController.getOne);

pdctRouter.post("/", uploader.single('thumbnails'), productsController.createOne);

pdctRouter.put("/:id", uploader.single('thumbnails'), productsController.updateOne); 

pdctRouter.delete("/:id", productsController.delete);
