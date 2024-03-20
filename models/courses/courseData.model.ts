import { Document, Schema } from "mongoose";
import { ILink, linkScheme } from "./link.model";
import { IComment, commentScheme } from "./comment.model";

export interface ICourseData extends Document {
    title: string;
    description: string;
    videoUrl: string;
    // videoThumbnail: string;
    videoSection: string;
    videoLength: number;
    videoPlayer: string;
    links: ILink[];
    suggestion: string;
    questions: IComment[]
}

export const courseDataScheme = new Schema<ICourseData>({
    videoUrl: String,
    // videoThumbnail: Object,
    title: String,
    videoSection: String,
    description: String,
    videoLength: Number,
    videoPlayer: String,
    links: [linkScheme],
    suggestion: String,
    questions: [commentScheme]
})