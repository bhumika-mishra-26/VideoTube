import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"

// Try to load .env from the project root
dotenv.config();

// Detailed configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null

        // Debug log to see what is actually being sent to Cloudinary
        console.log("Attempting upload with Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);

        // Upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        
        console.log("File is uploaded on cloudinary ", response.url);
        return response;

    } catch (error) {
        console.error("Cloudinary upload error details:", error);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
        return null;
    }
}

export default uploadToCloudinary;