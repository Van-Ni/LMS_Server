import cloudinary from "cloudinary";
import multer from "multer";

// ==========================
// Configure Multer
// ==========================

//lưu trữ trong bộ nhớ thay vì được ghi vào đĩa
const storage = multer.memoryStorage();
//Giới hạn kích thước tệp tối đa là 5MB.
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

// ==========================
// Update an image to Cloudinary
// ==========================
// Convert an Image or an Image URL to base64
export async function uploadImage(imageFile: Express.Multer.File, folder: string): Promise<{ public_id: string; secure_url: string } | null> {
    if (!imageFile) {
        return null; // Return null if no image is uploaded
    }
    const b64 = Buffer.from(imageFile.buffer).toString("base64");
    let dataURI = "data:" + imageFile.mimetype + ";base64," + b64;

    try {
        const res = await cloudinary.v2.uploader.upload(dataURI, { folder: `LMS/${folder}` });
        return { public_id: res.public_id, secure_url: res.secure_url };
    } catch (error) {
        console.error("Error uploading image:", error);
        return null; // Return null on upload error
    }
}


// ==========================
// Delete an image to Cloudinary
// ==========================
export async function deleteImage(publicId: string) {
    try {
        await cloudinary.v2.uploader.destroy(publicId);
        return true; // Indicate successful deletion
    } catch (error) {
        console.error('Error deleting image:', error);
        return false; // Indicate failure
    }
}