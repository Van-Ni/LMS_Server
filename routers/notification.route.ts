
import express from "express";
import { authorziteRoles, isAuthenticated } from "../middlewares/auth";
import { notificationController } from "../controllers/notification.controller";


const Router = express.Router();

Router.get("/get-all-notifications", isAuthenticated, authorziteRoles("admin"), notificationController.getNotifications);
Router.put("/update-notification/:id", isAuthenticated, authorziteRoles("admin"), notificationController.updateNotification);


export const notificationRoute = Router;