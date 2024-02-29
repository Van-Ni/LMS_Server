
import asyncHandler from "express-async-handler";
import express from "express";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import userModel from "../models/user.model";
import jwt, { Secret } from "jsonwebtoken";
import { env } from "../config/enviroment";
import sendMail from "../utils/sendMail";
interface IRegistrationBody {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

const registrationUser = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { name, email, password } = req.body;

    const isEmailExist = await userModel.findOne({ email })
    if (isEmailExist) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Email already exists"));
    }
    const user: IRegistrationBody = {
        name, email, password
    }
    const activationToken = createActivationToken(user);

    const data = {
        user: { name: user.name },
        activationCode: activationToken.activationCode
    }
    // const html = await ejs.renderFile(path.join(__dirname, "../mails/activation-mail.ejs"), data);

    try {
        await sendMail({
            email: user.email,
            subject: "Activate your account",
            template: "/activation-mail.ejs",
            data
        })

        res.status(StatusCodes.OK).json({
            success: true,
            message: `Please check your email: ${user.email} to activate your account`,
            activationToken: activationToken.token
        })
    } catch (error: any) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
    }
})

interface IActivationToken {
    token: string;
    activationCode: string;
}

const createActivationToken = (user: IRegistrationBody): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign({ user, activationCode }, env.ACTIVATION_SECRET as Secret, { expiresIn: "5m" })
    return { token, activationCode };
}

const activateUser = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log('🚀 ~ activateUser ~ req.body:', req.body)
    const { activation_token, activation_code } = req.body;

    // Verify the activation token
    const { user: newUser, activationCode } = jwt.verify(activation_token, env.ACTIVATION_SECRET as string) as { user: IRegistrationBody; activationCode: string };
    console.log('🚀 ~ activateUser:', newUser, activationCode)

    if (activationCode !== activation_code) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Invalid activation code"));
    }
    const { name, email, password } = newUser;

    const exitUser = await userModel.findOne({ email })
    if (exitUser) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Email already exists"));
    }
    const user = await userModel.create({ name, email, password });
    res.status(StatusCodes.CREATED).json({
        success: true,
        data: user
    });
})


export const userController = {
    registrationUser,
    activateUser
}