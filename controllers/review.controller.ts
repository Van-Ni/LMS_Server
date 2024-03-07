import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import CourseModel from "../models/course.model";
import { IReview } from "../models/review.model";
import { User } from "../models/user.model";


interface IAddReviewData {
    review: string;
    rating: number;
    userId: string;
}
const addReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const userCourseList = req.user?.courses;
    const courseId = req.params.id;

    // check courseExists
    const courseExists = userCourseList?.some((course) => course.courseId.toString() === courseId);

    if (!courseExists)
        return next(new ApiError(StatusCodes.NOT_FOUND, "You are not eligible to access this course"));

    const course = await CourseModel.findById(courseId);

    const { review, rating } = req.body as IAddReviewData;

    const newReview = {
        user: req.user,
        rating,
        comment: review,
        // commentReplies: []
    } as unknown as IReview;

    course?.reviews.push(newReview);

    // calculate avg of reviews
    let avg = 0;

    course?.reviews.forEach((review) => {
        avg += review.rating
    })

    if (course) course.ratings = avg / course?.reviews.length;

    await course?.save();

    // notification
    const notification = {
        title: "New Review Received",
        message: `${req.user?.name} has given a review in ${course?.name}`
    }

    // create notification

    res.status(StatusCodes.OK).json({
        success: true,
        course
    })
});

interface IAddReviewData {
    comment: string;
    reviewId: string;
}

const addReplyToReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { comment, reviewId } = req.body as IAddReviewData;
    const courseId = req.params.id;
    const course = await CourseModel.findById(courseId);

    if (!course)
        return next(new ApiError(StatusCodes.NOT_FOUND, "Course not found"));

    const review = course.reviews.find(r => r._id.toString() === reviewId);
    if (!review)
        return next(new ApiError(StatusCodes.NOT_FOUND, "Review not found"));

    const replyData = {
        user: req.user,
        comment
    } as unknown as { user: User; comment: String };

    if (!review.commentReplies)
        review.commentReplies = [];

    review.commentReplies?.push(replyData);

    await course.save();

    res.status(StatusCodes.OK).json({
        success: true,
        course
    })
});


export const reviewController = {
    addReview,
    addReplyToReview,
}