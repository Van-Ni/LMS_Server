import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { deleteImage, uploadImage } from "../utils/image";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { createCourseService, getAllCoursesService, getCourseByUserService, getSingleCourseService, updateCourseService } from "../services/course.service";

// #postman : How to add nested arrays and objects in the postman body via form-data
// https://usamaadev.hashnode.dev/how-to-add-nested-arrays-and-objects-in-the-postman-body-via-form-data

// =========================
// Create a course
// =========================
const uploadCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    const imageFile = req.file as Express.Multer.File;

    if (imageFile) {
        // upload new image
        const myCloud = await uploadImage(imageFile, "courses") as { public_id: string; secure_url: string };
        if (!myCloud) {
            return next(new ApiError(StatusCodes.BAD_REQUEST, "Error uploading image"));
        } else {
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        }
    }
    await createCourseService(data, res, next);
});

// =========================
// Edit a course
// =========================
const editCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const courseId = req.params.id;
    const imageFile = req.file as Express.Multer.File;

    const existingThumbnail = data.thumbnail;
    // Handle image deletion (if any)
    if (imageFile && existingThumbnail) {
        await deleteImage(existingThumbnail.public_id);
    }

    // Handle image upload (if any)
    if (imageFile) {
        // upload new image
        const myCloud = await uploadImage(imageFile, "courses") as { public_id: string; secure_url: string };
        if (!myCloud) {
            return next(new ApiError(StatusCodes.BAD_REQUEST, "Error uploading image"));
        } else {
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        }
    }
    await updateCourseService(courseId, data, res, next);
});

// =========================
// Get a course
// =========================
const getSingleCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id;

    await getSingleCourseService(courseId, res, next);
});

// =========================
// Get all courses
// =========================
const getAllCourses = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await getAllCoursesService(res, next);
});

// =========================
// Get course contents --only for valid user
// =========================
const getCourseByUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userCourseList = req.user?.courses;
    const courseId = req.params.id;

    const courseExists = userCourseList?.find(c => c.courseId.toString() === courseId)

    if (!courseExists)
        return next(new ApiError(StatusCodes.NOT_FOUND, "You are not eligible to access this course"));

    await getCourseByUserService(courseId, res, next);

});

// =========================
// Get all courses -- admin
// =========================


export const courseController = {
    uploadCourse,
    editCourse,
    getSingleCourse,
    getAllCourses,
    getCourseByUser
}
