import multer from "multer";
import path from "path";
import ApiError from "./apiError";

// Multer configuration for file upload
const upload = multer({
    dest: "uploads/", // 1. Where the file should be temporarily stored
    limits: { fileSize: 5 * 1024 * 1024 }, // 2. Maximum file size limit (5 MB)
    fileFilter: (req, file, cb) => {
        // 3. Filter to only allow certain file types
        const filetypes = /jpeg|jpg|png/; // 4. Accepted file types (JPEG, JPG, PNG)
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        ); // 5. Check file extension
        const mimetype = filetypes.test(file.mimetype); // 6. Check file mime type

        if (mimetype && extname) {
            return cb(null, true); // 7. If both checks pass, proceed with the upload
        } else {
            cb(new ApiError(400, "Only images (jpeg, jpg, png) are allowed.")); // 8. Reject files that don't meet criteria
        }
    },
});

export default upload;