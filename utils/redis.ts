import { Redis } from "ioredis";
import { env } from "../config/enviroment"


const redisClient = () => {
    if (env.REDIS_URL) {
        console.log("Redis client connected");
        return env.REDIS_URL;
    }
    throw new Error("Redis client not connected");
}

export const redis = new Redis(redisClient())