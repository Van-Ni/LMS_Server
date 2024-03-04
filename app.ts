import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction } from "express";
import { corsOptions } from "./config/cors";
import { StatusCodes } from "http-status-codes";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";
import { API_V1 } from "./routers";
import swaggerUi from 'swagger-ui-express';
// const swaggerFile = require('./swagger_output.json')
import swaggerFile from "./swagger_output.json"; // resolveJsonModule tsconfig.json
import { v2 as cloudinary } from 'cloudinary';
import { env } from "./config/enviroment";

// Set Up Your Work Environment
cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET
});

export const app = express();

// Sử dụng body-parser để phân tích cú pháp dữ liệu URL encoded
app.use(bodyParser.urlencoded({ extended: false }));

// Sử dụng body-parser để phân tích cú pháp dữ liệu JSON
app.use(bodyParser.json());

// Sử dụng cookie-parser để phân tích cú pháp cookie
app.use(cookieParser());

// CORS - Cross-Origin Resource Sharing.
app.use(cors(corsOptions))

// Router API : V1
app.use('/v1', API_V1)

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// Define your GET route handler
app.get('/api/data', (req, res) => {
    // Simulate fetching data (replace with your actual logic)
    const data = { message: 'Hello from the server!' };

    res.json(data); // Send data as JSON
});


app.all("*", (req: express.Request, res: express.Response, next: NextFunction) => {
    const error = new Error(`Route ${req.originalUrl} is not allowed}`) as any;
    error.statusCode = StatusCodes.NOT_FOUND;
    next(error);
});

// Error Handling in Express
app.use(errorHandlingMiddleware)