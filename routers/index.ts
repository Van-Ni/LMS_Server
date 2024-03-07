import express from "express";
import { userRoute } from "./user.route";
import { courseRoute } from "./course.route";
import { orderRoute } from "./order.route";
import { notificationRoute } from "./notification.route";



const Router = express.Router();

// Board APIs
Router.use("/api/user", userRoute)
Router.use("/api/course", courseRoute)
Router.use("/api/order", orderRoute)
Router.use("/api/notification", notificationRoute)

export const API_V1 = Router;