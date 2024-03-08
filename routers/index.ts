import express from "express";
import { userRoute } from "./user.route";
import { courseRoute } from "./course.route";
import { orderRoute } from "./order.route";
import { notificationRoute } from "./notification.route";
import { analyticsRoute } from "./analytics.route";



const Router = express.Router();

// Board APIs
Router.use("/api/user", userRoute)
Router.use("/api/course", courseRoute)
Router.use("/api/order", orderRoute)
Router.use("/api/notification", notificationRoute)
Router.use("/api/analytics", analyticsRoute)

export const API_V1 = Router;