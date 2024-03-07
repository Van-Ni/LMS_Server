import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import notificationModel from "../models/notification.model";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";

// ==============================
// Get Notification -- admin 
// ==============================
const getNotifications = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const notifications = await notificationModel.find().sort({ createdAt: -1 })

    res.status(StatusCodes.OK).json({
        success: true,
        notifications
    })
});

// ==============================
// Update Notification -- admin 
// ==============================
const updateNotification = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    // Update notification status using findOneAndUpdate method
    const updatedNotification = await notificationModel.findOneAndUpdate(
        { _id: req.params.id },
        { status: "read" },
        { new: true } // return the updated document
    );

    // Handle case where notification not found
    if (!updatedNotification) {
        return next(new ApiError(StatusCodes.NOT_FOUND, "Notification not found"));
    }

    // Fetch all notifications in descending order by creation date
    const updatedNotifications = await notificationModel.find().sort({ createdAt: -1 });

    // Respond with success and updated notifications
    res.status(StatusCodes.OK).json({ success: true, notifications: updatedNotifications });

});
export const notificationController = {
    getNotifications,
    updateNotification
}


