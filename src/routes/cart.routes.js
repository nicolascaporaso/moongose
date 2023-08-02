import { Router } from "express";
import { isAdmin, isUser, isUserCartOwner } from '../middlewares/auth.js';
import {cartsController} from '../controllers/carts.controller.js';
import { ticketController } from "../controllers/ticket.controller.js";

export const cartRouter = Router()

cartRouter.post("/", cartsController.createCart);

cartRouter.get("/:cid", cartsController.getById);

cartRouter.get("/:cid/purchase", ticketController.purchase);

cartRouter.get("/", cartsController.getCarts);

cartRouter.put("/:cid",isUser ,isUserCartOwner ,cartsController.updateCart);

cartRouter.put("/:cid/product/:pid",isUser, cartsController.addProductToCart);

cartRouter.delete("/:cid/product/:pid",isUser, cartsController.removeProductFromCart);

cartRouter.delete("/:cid",isUser, cartsController.deleteCart);

// Ruta para obtener el ID del carrito de la sesión activa
cartRouter.get("/cartid/id", isUser, cartsController.getCartActiveSession);
