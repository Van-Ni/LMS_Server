import mongoose, { Document, Model, Schema } from "mongoose";
import { IReview, reviewScheme } from "./review.model";
import { ICourseData, courseDataScheme } from "./courseData.model";

interface ICourse extends Document {
    name: string;
    description: string;
    price: number;
    estimatePrice?: number;
    thumbnail: string;
    tags: string;
    level: string;
    demoUrl: string;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    reviews: IReview[];
    courseData: ICourseData[];
    ratings?: number;
    purchased?: number;
}

const courseSchema = new Schema<ICourse>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    estimatePrice: Number,
    thumbnail: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    tags: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    demoUrl: {
        type: String,
        required: true
    },
    benefits: [
        {
            title: String
        }
    ],
    prerequisites: [
        {
            title: String
        }
    ],
    reviews: [reviewScheme],
    courseData: [courseDataScheme],
    ratings: {
        type: Number,
        default: 0
    },
    purchased: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

export const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);

export default CourseModel;