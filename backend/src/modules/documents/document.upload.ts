import multer from "multer";
import os from "os";
const storage = multer.memoryStorage();

// const storage = multer.diskStorage({
//   destination: os.tmpdir(),
//   filename: (_req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

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
