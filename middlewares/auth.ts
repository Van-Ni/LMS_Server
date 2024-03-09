import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { env } from "../config/enviroment";
import { redis } from "../utils/redis";
import { User } from "../models/user.model";

// ==========================
// Authenicated user
// ==========================
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const isAuthenticated = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const access_token = req.cookies.access_token as string;
    console.log('🚀 ~ isAuthenticated ~ req.cookies:', req.cookies)

    if (!access_token)
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Please login to access this resource."));

    const decode = jwt.verify(access_token, env.ACCESS_TOKEN as Secret) as JwtPayload;
    console.log('🚀 ~ isAuthenticated ~ decode:', decode)
    if (!decode)
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Access token is not valid."));

    const user = await redis.get(decode.id)
    if (!user)
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Please login to access this resource."));
    req.user = JSON.parse(user); // field password
    next();
})

export const authorziteRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log('🚀 ~ authorziteRoles ~ roles:', req.user)
        if (!roles.includes(req.user?.role || "")) {
            return next(new ApiError(StatusCodes.FORBIDDEN, `Role: ${req.user?.role} is not allowed to access to this resource.`));
        }
        next();
    }
}