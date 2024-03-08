import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { generateLast12MonthsData } from "../utils/analytics.generator";
import userModel from "../models/user.model";
import { StatusCodes } from "http-status-codes";
import CourseModel from "../models/course.model";
import notificationModel from "../models/notification.model";
import orderModel from "../models/order.model";


// ============================
// Get users analytics -- admin
// ============================
const getUsersAnalytics = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const users = await generateLast12MonthsData(userModel);

    res.status(StatusCodes.OK).json({
        success: true,
        users
    })
});


// ============================
// Get courses analytics -- admin
// ============================
const getCoursesAnalytics = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const courses = await generateLast12MonthsData(CourseModel);

    res.status(StatusCodes.OK).json({
        success: true,
        courses
    })
});

// ============================
// Get orders analytics -- admin
// ============================
const getOrdersAnalytics = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const orders = await generateLast12MonthsData(orderModel);

    res.status(StatusCodes.OK).json({
        success: true,
        orders
    })
});

// ============================
// Get notifications analytics -- admin
// ============================
const getNotificationsAnalytics = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const notifications = await generateLast12MonthsData(notificationModel);

    res.status(StatusCodes.OK).json({
        success: true,
        notifications
    })
});

export const analyticsController = {
    getUsersAnalytics,
    getCoursesAnalytics,
    getOrdersAnalytics,
    getNotificationsAnalytics
}