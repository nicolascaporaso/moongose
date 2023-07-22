import { Router } from "express";
import { isAdmin, isUser } from '../middlewares/auth.js';
import { viewsController } from "../controllers/view.controller.js";


export const viewRouter = Router()


viewRouter.get("/realtimeproducts", viewsController.viewRealTime);

viewRouter.get("/products", isUser, viewsController.getAllProducts);

viewRouter.get("/cart/:cid", isUser, viewsController.getCartById);
