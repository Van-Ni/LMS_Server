import express from "express";
import { analyticsController } from "../controllers/analytics.controller";
import { authorziteRoles, isAuthenticated } from "../middlewares/auth";

const Router = express.Router();

Router.get("/get-users-analytics", isAuthenticated, authorziteRoles("admin"), analyticsController.getUsersAnalytics)
Router.get("/get-orders-analytics", isAuthenticated, authorziteRoles("admin"), analyticsController.getOrdersAnalytics)
Router.get("/get-courses-analytics", isAuthenticated, authorziteRoles("admin"), analyticsController.getCoursesAnalytics)

export const analyticsRoute = Router;
