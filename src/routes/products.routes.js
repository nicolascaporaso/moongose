import { Router } from "express";
import { uploader } from "../utils/multer.js";
import {productsController} from "../controllers/products.controller.js";
import { isAdmin, isLoggedin } from "../middlewares/auth.js";

export const pdctRouter = Router()


pdctRouter.get('/', productsController.getAll);

pdctRouter.get("/:pid", productsController.getOne);

pdctRouter.post("/", uploader.single('thumbnails'), isLoggedin, productsController.createOne);

pdctRouter.put("/:id", uploader.single('thumbnails'),isAdmin, productsController.updateOne); 

pdctRouter.delete("/:id",isLoggedin, productsController.delete);
