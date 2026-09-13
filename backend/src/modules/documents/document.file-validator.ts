const signatures = {
  pdf: Buffer.from("%PDF-"),
  png: Buffer.from([
    0x89,
    0x50,
    0x4e,
    0x47,
    0x0d,
    0x0a,
    0x1a,
    0x0a,
  ]),
  jpeg: Buffer.from([
    0xff,
    0xd8,
    0xff,
  ]),
};

function startsWith(buffer: Buffer, signature: Buffer): boolean {
  return buffer.subarray(0, signature.length).equals(signature);
}

export function detectFileType(buffer: Buffer) {
  if (startsWith(buffer, signatures.pdf)) {
    return "application/pdf";
  }

  if (startsWith(buffer, signatures.png)) {
    return "image/png";
  }

  if (startsWith(buffer, signatures.jpeg)) {
    return "image/jpeg";
  }

  return null;
}