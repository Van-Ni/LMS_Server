import 'dotenv/config'

// #pattern: organize environment variables for common use 
//           Avoid import multiple times
export const env = {
    BUILD_MODE: process.env.BUILD_MODE,
    PORT: process.env.PORT,

    MONGODB_URL: process.env.MONGODB_URL,
    REDIS_URL: process.env.REDIS_URL,

    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
    ACTIVATION_SECRET: process.env.ACTIVATION_SECRET,

    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_MAIL: process.env.SMTP_MAIL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_POST: process.env.SMTP_POST
}