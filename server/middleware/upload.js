// middleware/upload.js
import multer from "multer";
import { storage } from "../utils/cloudinary.js";

export const upload = multer({ storage });
