import { Router } from "express";
import { uploader } from "../utils/utils.js";
import {productsController} from "../controllers/products.controller.js";
import { isAdmin } from "../middlewares/auth.js";

export const pdctRouter = Router()


pdctRouter.get('/', productsController.getAll);

pdctRouter.get("/:pid", productsController.getOne);

pdctRouter.post("/", uploader.single('thumbnails'), isAdmin, productsController.createOne);

pdctRouter.put("/:id", uploader.single('thumbnails'),isAdmin, productsController.updateOne); 

pdctRouter.delete("/:id",isAdmin, productsController.delete);
