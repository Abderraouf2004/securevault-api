const signatures = {
    pdf: Buffer.from("%PDF-"),
    png: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    jpeg: Buffer.from([0xff, 0xd8, 0xff]),
};
function startsWith(buffer, signature) {
    return buffer.subarray(0, signature.length).equals(signature);
}
function isWebp(buffer) {
    return (buffer.length >= 12 &&
        buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
        buffer.subarray(8, 12).toString("ascii") === "WEBP");
}
export function detectFileType(buffer) {
    if (startsWith(buffer, signatures.pdf)) {
        return "application/pdf";
    }
    if (startsWith(buffer, signatures.png)) {
        return "image/png";
    }
    if (startsWith(buffer, signatures.jpeg)) {
        return "image/jpeg";
    }
    if (isWebp(buffer)) {
        return "image/webp";
    }
    return null;
}
