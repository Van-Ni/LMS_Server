import express from "express";
import { userController } from "../controllers/user.controller";
import { authorziteRoles, isAuthenticated } from "../middlewares/auth";



const Router = express.Router();


Router.post("/registration", userController.registrationUser)
Router.post("/activate-user", userController.activateUser)
Router.post("/login", userController.loginUser)
Router.get("/logout", isAuthenticated, authorziteRoles("user"), userController.logoutUser)
Router.get("/refresh", userController.updateAccessToken)
Router.get("/me", isAuthenticated, userController.getUserInfo)
Router.post("/socialAuth", userController.socialAuth)


export const userRoute = Router;