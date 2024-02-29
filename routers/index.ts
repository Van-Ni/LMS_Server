import express from "express";
import { userRoute } from "./user.route";



const Router = express.Router();

// Board APIs
Router.use("/api/user", userRoute)

export const API_V1 = Router;