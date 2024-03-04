import express from "express";
import { userController } from "../controllers/user.controller";
import { authorziteRoles, isAuthenticated } from "../middlewares/auth";
import multer from "multer";



const Router = express.Router();

//lưu trữ trong bộ nhớ thay vì được ghi vào đĩa
const storage = multer.memoryStorage();
//Giới hạn kích thước tệp tối đa là 5MB.
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

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