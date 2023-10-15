import { Router } from "express";
import { isAdmin, isLoggedin, isUser } from '../middlewares/auth.js';
import { viewsController } from "../controllers/view.controller.js";
import { mockingController } from "../controllers/mocking.controller.js";


export const viewRouter = Router()


viewRouter.get("/realtimeproducts",isUser, viewsController.viewRealTime);

viewRouter.get("/products", isLoggedin, viewsController.getAllProducts);

viewRouter.get("/cart/:cid", viewsController.getCartById);

viewRouter.get("/mockingproducts", mockingController.get);

viewRouter.get("/users", isAdmin, viewsController.getAllUsers);
