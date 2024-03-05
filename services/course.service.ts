import { Response } from "express";
import CourseModel from "../models/course.model";
import { StatusCodes } from "http-status-codes";

export const createCourse = async (data: any, res: Response) => {
    const course = await CourseModel.create(data);

    res.status(StatusCodes.CREATED).json({
        success: true,
        data: course
    })
};
export const updateCourse = async (id: String, data: any, res: Response) => {
    const course = await CourseModel.findByIdAndUpdate(id, { $set: data }, { $new: true, $returnDocument: "after" });

    res.status(StatusCodes.CREATED).json({
        success: true,
        data: course
    })
};