import { Router } from "express";
import { isAdmin, isUser, isUserCartOwner, isLoggedin  } from '../middlewares/auth.js';
import {cartsController} from '../controllers/carts.controller.js';
import { ticketController } from "../controllers/ticket.controller.js";

export const cartRouter = Router()

cartRouter.post("/", cartsController.createCart);

cartRouter.get("/:cid", cartsController.getById);

cartRouter.get("/:cid/purchase", ticketController.purchase);

cartRouter.get("/", cartsController.getCarts);

cartRouter.put("/:cid", cartsController.updateCart);

cartRouter.put("/:cid/product/:pid", cartsController.addProductToCart);

cartRouter.delete("/:cid/product/:pid", cartsController.removeProductFromCart);

cartRouter.delete("/:cid", cartsController.deleteCart);

// Ruta para obtener el ID del carrito de la sesión activa
cartRouter.get("/cartid/id",  cartsController.getCartActiveSession);
