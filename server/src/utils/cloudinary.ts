import { v2 as cloudinary } from "cloudinary";
import ApiError from "./apiError";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Optimized Cloudinary upload function
const uploadToCloudinary = async (
  filePath: string,
  folder: string = "/common"
) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `nuvella/uploads/${folder}`, // Upload folder
      quality: "auto:eco", // Automatically optimize quality
      fetch_format: "webp", // Convert to webp format
      resource_type: "image", // Ensure it's processed as an image
    });
    return result.secure_url; // Return the optimized URL
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new ApiError(500, "Cloudinary upload failed");
  }
};

export default uploadToCloudinary;
