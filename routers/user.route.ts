import express from "express";
import { userController } from "../controllers/user.controller";
import { authorziteRoles, isAuthenticated } from "../middlewares/auth";
import { upload } from "../utils/image";



const Router = express.Router();



Router.post("/registration", userController.registrationUser)
Router.post("/activate-user", userController.activateUser)
Router.post("/login", userController.loginUser)
Router.get("/logout", isAuthenticated, authorziteRoles("admin"), userController.logoutUser)
Router.get("/refresh", userController.updateAccessToken)
Router.get("/me", isAuthenticated, userController.getUserInfo)
Router.post("/socialAuth", userController.socialAuth)
Router.put("/update-user-info", isAuthenticated, userController.updateUserInfo)
Router.put("/update-user-password", isAuthenticated, userController.updatePassword)
Router.put("/update-user-avatar", isAuthenticated, upload.single("image") ,userController.updateProfilePicture)


export const userRoute = Router;