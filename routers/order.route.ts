
import express from "express";
import { orderController } from "../controllers/order.controller";
import { authorziteRoles, isAuthenticated } from "../middlewares/auth";


const Router = express.Router();

Router.post("/create-order", isAuthenticated, orderController.createOrder);
Router.get("/all-orders", isAuthenticated,authorziteRoles("admin"), orderController.getAllOrders);


export const orderRoute = Router;