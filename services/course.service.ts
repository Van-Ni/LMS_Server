import { Response, NextFunction } from "express";
import CourseModel from "../models/course.model";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";
import { redis } from "../utils/redis";

export const createCourseService = async (data: any, res: Response, next: NextFunction) => {
    try {
        const course = await CourseModel.create(data);

        res.status(StatusCodes.CREATED).json({
            success: true,
            data: course
        })
    } catch (error: any) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
    }
};
export const updateCourseService = async (id: String, data: any, res: Response, next: NextFunction) => {
    try {
        const course = await CourseModel.findByIdAndUpdate(id, { $set: data }, { $new: true, $returnDocument: "after" });
        if (!course) {
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Course not found' });
        }
        res.status(StatusCodes.CREATED).json({
            success: true,
            data: course
        })
    } catch (error: any) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Error update course"));
    }

};

export const getSingleCourseService = async (id: String, res: Response, next: NextFunction) => {

    try {
        let course = null;
        const isCacheExist = await redis.get(id as string);
        if (isCacheExist) {
            course = JSON.parse(isCacheExist);
        } else {
            course = await CourseModel
                .findById(id)
                .select("-courseData.videoUrl -courseData.link -courseData.suggestion -courseData.questions");
            await redis.set(id as string, JSON.stringify(course))
            if (!course) {
                return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Course not found' });
            }
        }
        res.status(StatusCodes.CREATED).json({
            success: true,
            data: course
        })
    } catch (error: any) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
    }
};

export const getAllCoursesService = async (res: Response, next: NextFunction) => {
    try {
        let courses = null;
        const isCacheExist = await redis.get("allCourses");
        if (isCacheExist) {
            courses = await JSON.parse(isCacheExist)
        } else {
            courses = await CourseModel
                .find()
                .select("-courseData.videoUrl -courseData.link -courseData.suggestion -courseData.questions");
            await redis.set("allCourses", JSON.stringify(courses));
        }
        res.status(StatusCodes.CREATED).json({
            success: true,
            data: courses
        })
    } catch (error: any) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
    }
};

export const getCourseByUserService = async (id: string, res: Response, next: NextFunction) => {
    try {
        let course = null;
        const isCacheExist = await redis.get(id as string);
        if (isCacheExist) {
            course = JSON.parse(isCacheExist);
        } else {
            course = await CourseModel.findById(id)
            await redis.set(id as string, JSON.stringify(course))
            if (!course) {
                return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Course not found' });
            }
        }
        res.status(StatusCodes.CREATED).json({
            success: true,
            data: course.courseData
        })
    } catch (error: any) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
    }
}