import { Document, Schema } from "mongoose";

export interface IComment extends Document {
    user: object;
    comment: string;
    commentReplies?: IComment[];
}

export const commentScheme = new Schema<IComment>({
    user: Object,
    comment: String,
    commentReplies: [Object]
})