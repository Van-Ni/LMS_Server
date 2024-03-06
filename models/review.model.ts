import { Document, Schema } from "mongoose";
import { IComment } from "./comment.model";
import { User } from "./user.model";



export interface IReview extends Document {
    user: User;
    rating: number;
    comment: string;
    commentReplies?: { user: User; comment: String }[]
}
export const reviewScheme = new Schema<IReview>({
    user: Object,
    rating: {
        type: Number,
        default: 0
    },
    comment: String,
    commentReplies: [Object]
})