import express from "express";
import { userRoute } from "./user.route";
import { courseRoute } from "./course.route";



const Router = express.Router();

// Board APIs
Router.use("/api/user", userRoute)
Router.use("/api/course", courseRoute)

export const API_V1 = Router;