import express from "express";
import { userController } from "../controllers/user.controller";



const Router = express.Router();


Router.post("/register", userController.registrationUser)


export const userRoute = Router;