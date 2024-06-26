import { Schema, Document, model } from 'mongoose';


export interface FaqItem extends Document {
    question: string;
    answer: string;
}
export interface Category extends Document {
    title: string;
}
interface BannerImage extends Document {
    public_id: string;
    url: string;
}
interface Layout extends Document {
    type: string;
    faq: FaqItem[];
    categories: Category[];
    banner: {
        image: BannerImage;
        title: string;
        subtitle: string;
    };
}

const faqSchema = new Schema<FaqItem>({
    question: { type: String },
    answer: { type: String },
})
const categorySchema = new Schema<Category>({
    title: { type: String },
})
const bannerSchema = new Schema<BannerImage>({
    public_id: { type: String },
    url: { type: String },
})

const layoutSchema = new Schema<Layout>({
    type: { type: String },
    faq: [faqSchema],
    categories: [categorySchema],
    banner: {
        image: bannerSchema,
        title: { type: String },
        subtitle: { type: String },
    }
})

const layoutModel = model<Layout>('Layout', layoutSchema);

export default layoutModel;