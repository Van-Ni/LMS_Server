import express from "express";
import { authorziteRoles, isAuthenticated } from "../middlewares/auth";
import { upload } from "../utils/image";
import { courseController } from "../controllers/course.controller";
import { questionController } from "../controllers/question.controller";
import { reviewController } from "../controllers/review.controller";



const Router = express.Router();

Router.route('/')
    .post(isAuthenticated, authorziteRoles("admin"), upload.single("image"), courseController.uploadCourse)
    .get(courseController.getAllCourses)

Router.route('/:id')
    .put(isAuthenticated, authorziteRoles("admin"), upload.single("image"), courseController.editCourse)
    .get(courseController.getSingleCourse)

Router.get("/get-course-content/:id", isAuthenticated, courseController.getCourseByUser)
Router.put("/add-question", isAuthenticated, questionController.addQuestion)
Router.put("/add-answer", isAuthenticated, questionController.addAnswer)
Router.put("/add-review/:id", isAuthenticated, reviewController.addReview)
Router.put("/add-reply/:id", isAuthenticated, authorziteRoles("admin"), reviewController.addReplyToReview)
Router.get("/admin/all-courses", isAuthenticated, authorziteRoles("admin"), courseController.getAllCourses)
Router.delete("/admin/delete-course/:id", isAuthenticated, authorziteRoles("admin"), courseController.deleteCourse)

Router.post("/vdoCipher/getOTP", courseController.generateVideoUrl)

export const courseRoute = Router;