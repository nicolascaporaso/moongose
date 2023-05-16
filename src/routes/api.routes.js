import { Router } from "express";
import {pdctRouter} from "./products.routes.js";
import {cartRouter} from "./carts.routes.js";

export const apiRouter = Router()

apiRouter.use("/products", pdctRouter)
apiRouter.use("/carts", cartRouter)