import { Response } from "express";
import { redis } from "../utils/redis";


export const getUserById = async (id: string, res: Response) => {
    const userJson = await redis.get(id);
    res.status(200).json({
        success: true,
        user: userJson ? JSON.parse(userJson) : null
    })
}