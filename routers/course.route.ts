import express from "express";
import { authorziteRoles, isAuthenticated } from "../middlewares/auth";
import { upload } from "../utils/image";
import { courseController } from "../controllers/course.controller";



const Router = express.Router();

Router.route('/')
    .post(isAuthenticated, authorziteRoles("admin"), upload.single("image"), courseController.uploadCourse)
    .get(courseController.getAllCourses)

Router.route('/:id')
    .put(isAuthenticated, authorziteRoles("admin"), upload.single("image"), courseController.editCourse)
    .get(courseController.getSingleCourse)



export const courseRoute = Router;