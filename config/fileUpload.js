import cloudinaryPackage from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import dotenv from "dotenv";
dotenv.config();


const cloudinary = cloudinaryPackage.v2;

// config cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY, // ✅ NOTE: spelling must be "api_secret"
});


// create storage engine for multer

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ["jpg", "png", "jpeg"],
    params: {
        folder: "Ecommerce-api",
    },
});

const upload = multer({
    storage,
     //limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;