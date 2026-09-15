// import fs from "fs/promises";
// import path from "path";
// import crypto from "crypto";
// const uploadDirectory = path.resolve("uploads");
// const extensionByMimeType: Record<string, string> = {
//   "application/pdf": ".pdf",
//   "image/png": ".png",
//   "image/jpeg": ".jpg",
// };
// export async function saveUploadedFile(buffer: Buffer, mimeType: string) {
//   const extension = extensionByMimeType[mimeType];
//   if (!extension) {
//     throw new Error("Unsupported file type");
//   }
//   await fs.mkdir(uploadDirectory, {
//     recursive: true,
//   });
//   const storedName = `${crypto.randomUUID()}${extension}`;
//   const filePath = path.join(uploadDirectory, storedName);
//   await fs.writeFile(filePath, buffer);
//   return {
//     storedName,
//     filePath,
//   };
// }
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
const uploadDirectory = path.resolve("uploads");
const extensionByMimeType = {
    "application/pdf": ".pdf",
    "image/png": ".png",
    "image/jpeg": ".jpg",
};
export async function saveUploadedFile(buffer, mimeType) {
    const extension = extensionByMimeType[mimeType];
    if (!extension) {
        throw new Error("Unsupported file type");
    }
    await fs.mkdir(uploadDirectory, {
        recursive: true,
    });
    const storedName = `${crypto.randomUUID()}${extension}`;
    const filePath = path.join(uploadDirectory, storedName);
    await fs.writeFile(filePath, buffer);
    return {
        storedName,
        filePath,
    };
}
export async function saveAvatar(buffer, mimeType) {
    const extensionByMimeTypeAvatar = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
    };
    const extension = extensionByMimeTypeAvatar[mimeType];
    if (!extension) {
        throw new Error("Unsupported avatar type");
    }
    const avatarDirectory = path.resolve("uploads/avatars");
    await fs.mkdir(avatarDirectory, {
        recursive: true,
    });
    const storedName = `${crypto.randomUUID()}${extension}`;
    const filePath = path.join(avatarDirectory, storedName);
    await fs.writeFile(filePath, buffer);
    return `/uploads/avatars/${storedName}`;
}
