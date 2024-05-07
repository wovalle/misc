const { promisify } = require("util");
const fs = require("fs");
const convert = require("heic-convert");

(async () => {
  const images = await promisify(fs.readdir)("photos");

  for (const image of images) {
    const path = `photos/${image}`;
    const inputBuffer = await promisify(fs.readFile)(path);
    const imageParts = image.split(".");
    const extension = imageParts.pop();
    const filename = imageParts.join(".");

    if (["converted", "padded"].some((c) => filename.includes(c))) {
      continue;
    }

    if (!["HEIC"].some((c) => extension.includes(c))) {
      continue;
    }

    const outputBuffer = await convert({
      buffer: inputBuffer, // the HEIC file buffer
      format: "PNG", // output format
    });

    await promisify(fs.writeFile)(
      "photos/" + filename + ".converted.png",
      outputBuffer
    );
  }
})();
