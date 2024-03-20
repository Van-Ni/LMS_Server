import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { deleteImage, uploadImage } from "../utils/image";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import layoutModel, { Category, FaqItem } from "../models/layout.model";

interface Banner {
    title: string;
    subtitle: string;
    image?: { public_id: string; url: string };
}
const createLayout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { type } = req.body;

    const isTypeExist = await layoutModel.findOne({ type });
    console.log('🚀 ~ createLayout ~ isTypeExist:', isTypeExist)
    if (isTypeExist) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: `${type} already exist` });
        return;
    }

    if (type === "Banner") {
        const { title, subtitle } = req.body;
        let banner: Banner = {
            title,
            subtitle,
        }
        const imageFile = req.file as Express.Multer.File;
        if (imageFile) {
            // upload new image
            const myCloud = await uploadImage(imageFile, "layout") as { public_id: string; secure_url: string };
            if (!myCloud) {
                return next(new ApiError(StatusCodes.BAD_REQUEST, "Error uploading image"));
            } else {
                banner.image = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                };
            }
        }
        await layoutModel.create({ type, banner });
    }
    if (type === "FAQ") {
        const { faqItems } = req.body as { faqItems: FaqItem[] };
        await layoutModel.create({ type, faq: faqItems });
    }
    if (type === "Categories") {
        const { categories } = req.body as { categories: Category[] };
        await layoutModel.create({ type, categories });
    }

    res.status(StatusCodes.OK).json({
        success: true,
        message: "Layout created successfully"
    })
});

const updateLayout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.body;

    const existingLayout = await layoutModel.findOne({
        type
    });

    if (!existingLayout) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Layout not found' });
        return;
    }

    if (type === "Banner") {
        const { title, subtitle } = req.body;

        let banner: Banner = {
            title,
            subtitle,
        }
        const imageFile = req.file as Express.Multer.File;
        const existingThumbnail = existingLayout.banner.image || "";

        if (imageFile && existingThumbnail)
            await deleteImage(existingThumbnail.public_id);

        if (imageFile) {
            // upload new image
            const myCloud = await uploadImage(imageFile, "layout") as { public_id: string; secure_url: string };
            if (!myCloud) {
                return next(new ApiError(StatusCodes.BAD_REQUEST, "Error uploading image"));
            } else {
                banner.image = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                };
            }
        }
        await layoutModel.findByIdAndUpdate(existingLayout._id, { banner });
    }
    if (type === "FAQ") {
        const { faqItems } = req.body as { faqItems: FaqItem[] };
        await layoutModel.findByIdAndUpdate(existingLayout._id, { faq: faqItems });
    }
    if (type === "Categories") {
        const { categories } = req.body as { categories: Category[] };
        await layoutModel.findByIdAndUpdate(existingLayout._id, { categories });
    }

    res.status(StatusCodes.OK).json({
        success: true,
        message: "Layout Update successfully"
    })
});

const getLayout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.params;
    console.log('🚀 ~ getLayout ~ type:', type)

    const layout = await layoutModel.findOne({
        type
    });

    if (!layout) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Layout not found' });
        return;
    }

    res.status(StatusCodes.OK).json({
        success: true,
        layout
    })
});

export const layoutController = {
    createLayout,
    updateLayout,
    getLayout
}