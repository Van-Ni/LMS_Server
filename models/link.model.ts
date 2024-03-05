import { Document, Schema } from "mongoose";

export interface ILink extends Document {
    title: string;
    url: string;
}

export const linkScheme = new Schema<ILink>({
    title: String,
    url: String
})