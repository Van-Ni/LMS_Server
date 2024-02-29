import 'dotenv/config'

// #pattern: organize environment variables for common use 
//           Avoid import multiple times
export const env = {
    BUILD_MODE: process.env.BUILD_MODE,
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
    REDIS_URL: process.env.REDIS_URL,
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS
}