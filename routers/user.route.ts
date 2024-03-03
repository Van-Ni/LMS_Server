import express from "express";
import { userController } from "../controllers/user.controller";
import { authorziteRoles, isAuthenticated } from "../middlewares/auth";



const Router = express.Router();


Router.post("/registration", userController.registrationUser)
Router.post("/activate-user", userController.activateUser)
Router.post("/login", userController.loginUser)
Router.post("/logout", isAuthenticated, authorziteRoles("admin"), userController.logoutUser)


export const userRoute = Router;