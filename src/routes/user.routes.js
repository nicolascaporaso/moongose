import { Router } from "express";
import { isAdmin, isLoggedin, isUser } from '../middlewares/auth.js';
import { userController } from "../controllers/users.controller.js";


export const usersRouter = Router()

usersRouter.get("/", isAdmin, userController.listUsers);

usersRouter.delete("/", isAdmin, userController.deleteInactiveUsers);

usersRouter.delete("/delete/:ID", isAdmin, userController.deleteUser);

usersRouter.put("/role/:ID", isAdmin, userController.changeRole);
