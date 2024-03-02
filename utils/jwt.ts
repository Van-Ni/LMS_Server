import { Response } from "express";
import { env } from "../config/enviroment";
import { User } from "../models/user.model";
import { redis } from "./redis";

interface ITokenExpires {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: 'lax' | 'strict' | 'none' | undefined;
    secure?: boolean;
}

export const sendToken = ((user: User, statusCode: number, res: Response) => {
    const accessToken = user.signAccessToken();
    console.log('🚀 ~ sendToken ~ accessToken:', accessToken)
    const refreshToken = user.signRefreshToken();

    // upload session to redis
    // https://console.upstash.com/redis/05c64fbd-df2e-45de-9252-9ba4ffc9d36d?tab=data-browser
    redis.set(user._id, JSON.stringify(user))

    // parse environment variables to integrates with fallback values
    const accessTokenExpires = parseInt(env.ACCESS_TOKEN_EXPIRE || '', 10)
    const refreshTokenExpires = parseInt(env.REFRESH_TOKEN_EXPIRE || '', 10)

    // options for cookies
    const accessTokenOptions: ITokenExpires = {
        expires: new Date(Date.now() + accessTokenExpires * 1000),
        maxAge: accessTokenExpires * 1000,
        httpOnly: true,
        sameSite: 'lax',
    }
    const refreshTokenOptions: ITokenExpires = {
        expires: new Date(Date.now() + refreshTokenExpires * 1000),
        maxAge: refreshTokenExpires * 1000,
        httpOnly: true,
        sameSite: 'lax',
    }

    if (env.BUILD_MODE === "production") {
        accessTokenOptions.secure = true;
    }

    res.cookie("access_token", accessToken, accessTokenOptions)
    res.cookie("resfresh_token", refreshToken, refreshTokenOptions)

    res.status(statusCode).json({
        success: true,
        user,
        accessToken
    })
})

export const resetToken = (res: Response) => {
    res.cookie("access_token", "", { maxAge: 1 })
    res.cookie("resfresh_token", "", { maxAge: 1 })
}