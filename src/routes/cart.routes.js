import { Router } from "express";
import { isAdmin, isUser, isUserCartOwner, isLoggedin, isUserCartOwnerOrAdmin  } from '../middlewares/auth.js';
import {cartsController} from '../controllers/carts.controller.js';
import { ticketController } from "../controllers/ticket.controller.js";

export const cartRouter = Router()

cartRouter.post("/",isLoggedin, cartsController.createCart);

cartRouter.get("/:cid", isUserCartOwner, cartsController.getById);

cartRouter.get("/:cid/purchase", isUserCartOwner, ticketController.purchase);

cartRouter.get("/", isAdmin, cartsController.getCarts);

cartRouter.put("/:cid", isUserCartOwner, cartsController.updateCart);

cartRouter.put("/:cid/product/:pid", isUserCartOwner, cartsController.addProductToCart);

cartRouter.delete("/:cid/product/:pid",isUserCartOwner, cartsController.removeProductFromCart);

cartRouter.delete("/:cid", isUserCartOwnerOrAdmin, cartsController.deleteCart);

// Ruta para obtener el ID del carrito de la sesión activa
cartRouter.get("/cartid/id",  cartsController.getCartActiveSession);
