import fs from "node:fs";
import sharp from "sharp";

// Folder containing the input images
const inputFolder = "photos";
const output = "output";

// Padding size
const paddingSize = 500;

// Create the output folder if it doesn't exist
await fs.promises
  .readdir(inputFolder)
  .then((files) => {
    // Process each image file
    return Promise.all(
      files.map((file) => {
        const parts = file.split(".");
        const extension = parts.pop();
        const filename = parts.join(".");

        if (["padded"].some((c) => filename.includes(c))) {
          return;
        }

        // Check if the file is an image (you may want to add additional checks here)
        if (
          file.endsWith(".jpg") ||
          file.endsWith(".jpeg") ||
          file.endsWith(".png")
        ) {
          // Input and output paths
          const inputPath = `${inputFolder}/${file}`;
          const outputPath = `${output}/${filename}-padded.${extension}`;

          // Apply padding to the image
          return sharp(inputPath)
            .extend({
              top: paddingSize,
              bottom: paddingSize,
              left: paddingSize,
              right: paddingSize,
              background: { r: 255, g: 255, b: 255, alpha: 0 }, // Transparent padding
            })
            .toFile(outputPath)
            .then(() => console.log(`Image ${file} processed successfully`))
            .catch((err) =>
              console.error(`Error processing image ${file}:`, err)
            );
        }
      })
    );
  })
  .catch((err) => console.error("Error:", err));
