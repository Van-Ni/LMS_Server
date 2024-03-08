import { Document, Schema } from "mongoose";
import { User } from "../user.model";

export interface IComment extends Document {
    user: User;
    question: string;
    questionReplies?: IComment[];
}

export const commentScheme = new Schema<IComment>({
    user: Object,
    question: String,
    questionReplies: [Object]
})