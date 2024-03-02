import express from "express";
import { userController } from "../controllers/user.controller";



const Router = express.Router();


Router.post("/registration", userController.registrationUser)
Router.post("/activate-user", userController.activateUser)
Router.post("/login", userController.loginUser)
Router.post("/logout", userController.logoutUser)


export const userRoute = Router;