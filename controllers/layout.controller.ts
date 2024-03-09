import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { uploadImage } from "../utils/image";
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
        const { type, faq } = req.body as { type: string, faq: FaqItem[] };
        await layoutModel.create({ type, faq });
    }
    if (type === "Categories") {
        const { type, categories } = req.body as { type: string, categories: Category };
        await layoutModel.create({ type, categories });
    }

    res.status(StatusCodes.OK).json({
        success: true,
        message: "Layout created successfully"
    })
});

export const layoutController = {
    createLayout
}