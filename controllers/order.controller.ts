import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import orderModel, { IOrder } from "../models/order.model";
import CourseModel from "../models/course.model";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import userModel from "../models/user.model";
import sendMail from "../utils/sendMail";
import notificationModel from "../models/notification.model";


const createOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { courseId, payment_info } = req.body as IOrder;

    // find course
    const course = await CourseModel.findById(courseId);
    console.log('🚀 ~ createOrder ~ course:', course)
    if (!course)
        return next(new ApiError(StatusCodes.NOT_FOUND, "Course not found"));

    // check course exists in user
    const user = await userModel.findById(req.user?._id);

    const courseExistInUser = user?.courses.some(c => c.courseId.toString() === courseId);
    if (courseExistInUser)
        return next(new ApiError(StatusCodes.BAD_REQUEST, "You have already purchased this course"));

    // create new order
    const data = {
        courseId,
        userId: user?._id,
        payment_info
    }
    const order = await orderModel.create(data);

    // send mail
    const mailData = {
        order: {
            _id: course._id.toString().slice(0, 6),
            name: course.name,
            price: course.price,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        }
    }

    try {
        await sendMail({
            email: user?.email || "",
            subject: "Order Confirmation",
            template: "/order-confirmation.ejs",
            data: mailData
        })

    } catch (error: any) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
    }

    // save course for user
    user?.courses.push({ courseId: course?._id })
    await user?.save();

    // create notification
    await notificationModel.create({
        userId: user?._id,
        title: "New order",
        message: `You have a new order from ${course.name}`
    });

    // increase purchase 
    await CourseModel.findOneAndUpdate(
        { _id: courseId },
        { $inc: { purchased: 1 } }
    );

    res.status(StatusCodes.CREATED).json({
        success: true,
        order
    })

});

const getAllOrders = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const orders = await orderModel.find().sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({
        success: true,
        orders
    })
});

export const orderController = {
    createOrder,
    getAllOrders
}