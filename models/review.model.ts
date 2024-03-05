import { Document, Schema } from "mongoose";
import { IComment, commentScheme } from "./comment.model";



export interface IReview extends Document {
    user: object;
    rating: number;
    comment: string;
    commentReplies: IComment[]
}
export const reviewScheme = new Schema<IReview>({
    user: Object,
    rating: {
        type: Number,
        default: 0
    },
    comment: String
})