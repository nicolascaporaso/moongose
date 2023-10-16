import { Router } from "express";
import { isAdmin, isLoggedin, isUser } from '../middlewares/auth.js';
import { viewsController } from "../controllers/view.controller.js";
import { mockingController } from "../controllers/mocking.controller.js";


export const viewRouter = Router()


viewRouter.get("/realtimeproducts",isLoggedin, viewsController.viewRealTime);

viewRouter.get("/products", isLoggedin, viewsController.getAllProducts);

viewRouter.get("/cart/:cid", isLoggedin, viewsController.getCartById);

viewRouter.get("/mockingproducts",isAdmin, mockingController.get);

viewRouter.get("/users", isAdmin, viewsController.getAllUsers);

viewRouter.get("/ticket/:cid", viewsController.Ticket);