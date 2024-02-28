import 'dotenv/config'

// #pattern: organize environment variables for common use 
//           Avoid import multiple times
export const env = {
    BUILD_MODE: process.env.BUILD_MODE,
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL

}