
import asyncHandler from "express-async-handler";
import express, { response } from "express";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import userModel from "../models/user.model";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { env } from "../config/enviroment";
import sendMail from "../utils/sendMail";
import { accessTokenOptions, refreshTokenOptions, resetToken, sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";
import { getUserById } from "../services/user.service";
import { deleteImage, uploadImage } from "../utils/image";

// ==========================
// Registration User
// ==========================
interface IRegistrationBody {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

const registrationUser = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { name, email, password } = req.body as IRegistrationBody;

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

// ==========================
// Create activivation token
// ==========================

interface IActivationToken {
    token: string;
    activationCode: string;
}

const createActivationToken = (user: IRegistrationBody): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign({ user, activationCode }, env.ACTIVATION_SECRET as Secret, { expiresIn: "5m" })
    return { token, activationCode };
}

// ==========================
// Activate user
// ==========================

const activateUser = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { activation_token, activation_code } = req.body;

    // Verify the activation token
    const { user: newUser, activationCode } = jwt.verify(activation_token, env.ACTIVATION_SECRET as string) as { user: IRegistrationBody; activationCode: string };

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
        user
    });
})

// ==========================
// Login User
// ==========================
interface ILoginRequest {
    email: string;
    password: string;
}
export const loginUser = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { email, password } = req.body as ILoginRequest;

    // validate email and password
    if (!email || !password)
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Please enter email and password."));

    // check if user is existing
    const user = await userModel.findOne({ email }).select("+password");
    if (!user)
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Invalid email and password."));

    // check password validity
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch)
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Invalid email and password."));

    // Send Token and Cookies to the Browser
    sendToken(user, StatusCodes.OK, res);
})


// ==========================
// Logout User
// ==========================

export const logoutUser = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    resetToken(res);
    redis.del(req.user?._id);
    res.status(StatusCodes.OK).json({
        success: true,
        message: "Logged out successfully"
    })
});

// ==========================
// Update access token
// ==========================
export const updateAccessToken = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const refresh_token = req.cookies.refresh_token as string;
    const decoded = jwt.verify(refresh_token, env.REFRESH_TOKEN as Secret) as JwtPayload;

    const message = "Cloud not refresh token.";
    if (!decoded)
        return next(new ApiError(StatusCodes.BAD_REQUEST, message));

    const session = await redis.get(decoded.id as string);
    if (!session)
        return next(new ApiError(StatusCodes.BAD_REQUEST, message));

    const user = JSON.parse(session);

    req.user = user;

    const accessToken = jwt.sign({ id: user._id }, env.ACCESS_TOKEN as Secret || "", {
        expiresIn: "5m"
    })
    const refreshToken = jwt.sign({ id: user._id }, env.REFRESH_TOKEN as Secret || "", {
        expiresIn: "3d"
    })

    res.cookie("access_token", accessToken, accessTokenOptions)
    res.cookie("refresh_token", refreshToken, refreshTokenOptions)

    res.status(StatusCodes.OK).json({
        success: true,
        accessToken
    })
});

// ==========================
// Get user information
// ==========================
const getUserInfo = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userId = req.user?._id;
    getUserById(userId, res);
})

// ==========================
// Social Auth
// ==========================
interface ISocialAuthBody {
    email: string;
    name: string;
    avatar?: string;
}

const socialAuth = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { email, name, avatar } = req.body as ISocialAuthBody;
    const user = await userModel.findOne({ email });
    if (!user) {
        const newUser = await userModel.create({ email, name, avatar })
        sendToken(newUser, StatusCodes.CREATED, res);
    } else {
        sendToken(user, StatusCodes.CREATED, res);
    }
})

// ==========================
// Update User Info
// ==========================
interface IUpdateInfo {
    name?: string;
    email?: string;
}
const updateUserInfo = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { name, email } = req.body as IUpdateInfo;

    const userId = req.user?._id;
    const user = await userModel.findById(userId);

    if (!user)
        return next(new ApiError(StatusCodes.NOT_FOUND, "User not found"));

    if (email && user) {
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist)
            return next(new ApiError(StatusCodes.BAD_REQUEST, "Email already exists"));
        user.email = email;
    }

    if (name && user)
        user.name = name;

    await user?.save();

    await redis.set(userId, JSON.stringify(user));

    res.status(StatusCodes.CREATED).json({
        success: true,
        user
    })
})

// ==========================
// Update User Password
// ==========================

interface IUpdatePassword {
    oldPassword: string;
    newPassword: string;
}
const updatePassword = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { oldPassword, newPassword } = req.body as IUpdatePassword;

    if (!oldPassword || !newPassword)
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Please enter old or new password"));

    const user = await userModel.findById(req.user?._id).select("+password");

    if (user?.password === undefined)
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Invalid user"));

    const isPasswordMatch = await user.comparePassword(oldPassword);

    if (!isPasswordMatch)
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Invalid old password"));

    user.password = newPassword;

    await user.save();
    await redis.set(user._id, JSON.stringify(user));

    res.status(StatusCodes.OK).json({
        success: true,
        user
    })

});


// ==========================
// Update Profile Picture
// ==========================
const updateProfilePicture = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const imageFile = req.file as Express.Multer.File;
    const userId = req.user?._id;
    const user = await userModel.findById(userId);

    if (imageFile && user) {
        // delete old avatar
        if (user.avatar.public_id) {
            await deleteImage(user.avatar.public_id);
        }
        // upload new image
        const avatarUrl = await uploadImage(imageFile, "avatars") as { public_id: string; secure_url: string };
        if (!avatarUrl) {
            return next(new ApiError(StatusCodes.BAD_REQUEST, "Error uploading image"));
        } else {
            user.avatar = {
                public_id: avatarUrl.public_id,
                url: avatarUrl.secure_url
            };
        }
    }

    await user?.save();
    await redis.set(userId, JSON.stringify(user))

    res.status(StatusCodes.OK).json({
        success: true,
        user
    })
});

// ==========================
// Update Profile Picture -- admin
// ==========================
const getAllUsers = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const users = await userModel.find().sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({
        success: true,
        users
    })
});

export const userController = {
    registrationUser,
    activateUser,
    loginUser,
    logoutUser,
    updateAccessToken,
    getUserInfo,
    socialAuth,
    updateUserInfo,
    updatePassword,
    updateProfilePicture,
    getAllUsers
}