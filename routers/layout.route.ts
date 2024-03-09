import express from "express";
import { authorziteRoles, isAuthenticated } from "../middlewares/auth";
import { layoutController } from "../controllers/layout.controller";
import { upload } from "../utils/image";

const Router = express.Router();

Router.post("/create-layout", isAuthenticated, authorziteRoles("admin"), upload.single("image"), layoutController.createLayout)
Router.put("/update-layout", isAuthenticated, authorziteRoles("admin"), upload.single("image"), layoutController.updateLayout)
Router.get("/get-layout", layoutController.getLayout)

export const layoutRoute = Router;
