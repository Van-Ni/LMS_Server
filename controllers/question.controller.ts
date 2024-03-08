import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import CourseModel from "../models/courses/course.model";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { ICourseData } from "../models/courses/courseData.model";
import { IComment } from "../models/courses/comment.model";
import sendMail from "../utils/sendMail";
import notificationModel from "../models/notification.model";


// =========================
// Add a question - courseData model
// =========================
interface IAddQuestionData {
    question: string;
    courseId: string;
    contentId: string;
}

const addQuestion = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { question, courseId, contentId } = req.body as IAddQuestionData;

    const course = await CourseModel.findById(courseId);

    if (!mongoose.Types.ObjectId.isValid(contentId))
        return next(new ApiError(StatusCodes.NOT_FOUND, "Invalid content id"));

    const courseContent = course?.courseData.find((item: ICourseData) => item._id.equals(contentId));

    if (!courseContent)
        return next(new ApiError(StatusCodes.NOT_FOUND, "Invalid content id"));

    const newQuestion = {
        // TODO: only feild necessary 
        user: req.user ? req.user : {},
        question,
        questionReplies: []
    } as unknown as IComment;

    courseContent.questions.push(newQuestion as IComment);

    // create notification
    await notificationModel.create({
        userId: req.user?._id,
        title: "New question received",
        message: `You have new question in ${courseContent?.title}`
    });

    await course?.save();

    res.status(StatusCodes.OK).json({
        success: true,
        course
    })

});

// =========================
// Add a answer into questionReplies - comment model
// =========================

interface IAddAnswerData {
    answer: string;
    courseId: string;
    contentId: string;
    questionId: string;
}

const addAnswer = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { answer, courseId, contentId, questionId } = req.body as IAddAnswerData;

    // find course
    const course = await CourseModel.findById(courseId);

    if (!mongoose.Types.ObjectId.isValid(contentId))
        return next(new ApiError(StatusCodes.NOT_FOUND, "Invalid content id"));

    // find courseData
    const courseContent = course?.courseData.find((item: ICourseData) => item._id.equals(contentId));

    if (!courseContent)
        return next(new ApiError(StatusCodes.NOT_FOUND, "Invalid content id"));

    // find question
    const question = courseContent.questions.find((item: IComment) => item._id.equals(questionId));

    if (!question)
        return next(new ApiError(StatusCodes.NOT_FOUND, "Invalid question id"));

    // add answer
    const newAnswer = {
        // TODO: only feild necessary 
        user: req.user ? req.user : {},
        answer,
    } as unknown as IComment;

    question.questionReplies?.push(newAnswer);

    await course?.save();

    if (req.user?._id === question.user._id) {
        // create notification
        await notificationModel.create({
            userId: req.user?._id,
            title: "New question reply received",
            message: `You have a new question reply in ${courseContent?.title}`
        });
    } else {
        // question reply
        const data = {
            name: question.user.name,
            title: courseContent.title
        }

        try {
            await sendMail({
                email: question.user.email,
                subject: "Question reply",
                template: "/question-reply.ejs",
                data
            })
        } catch (error: any) {
            return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
        }
    }

    res.status(StatusCodes.OK).json({
        success: true,
        course
    })
});
export const questionController = {
    addQuestion,
    addAnswer
}