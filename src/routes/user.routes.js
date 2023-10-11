import { Router } from "express";
import { isAdmin, isLoggedin, isUser } from '../middlewares/auth.js';
import { userController } from "../controllers/users.controller.js";


export const usersRouter = Router()

usersRouter.get("/", isAdmin, userController.listUsers);

usersRouter.delete("/", isAdmin, userController.deleteInactiveUsers);

