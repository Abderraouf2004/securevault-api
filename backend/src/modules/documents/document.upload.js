import multer from "multer";
const storage = multer.memoryStorage();
export const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});
export const avatarUpload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
});
