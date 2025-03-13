import fs from "fs";
import path from "path";

// Ensure the uploads directory exists
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Function to save a file locally
export const saveFileLocally = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filePath = path.join(uploadDir, filename);

    // Save the file to the uploads directory
    fs.writeFileSync(filePath, buffer);

    // Return the file URL
    return `/uploads/${filename}`;
  } catch (error) {
    console.error("Error saving file locally:", error);
    throw new Error("Failed to save file");
  }
};
