
import express from "express";
import { orderController } from "../controllers/order.controller";
import { isAuthenticated } from "../middlewares/auth";


const Router = express.Router();

Router.post("/create-order", isAuthenticated, orderController.createOrder);


export const orderRoute = Router;