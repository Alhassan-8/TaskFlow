import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

// Derive __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define icon sizes to generate
const sizes = [32, 192, 512];
// SVG source file
const inputSvg = path.resolve(__dirname, "../public/favicon.svg");

for (const size of sizes) {
  // Use favicon.png for size 32, otherwise icon-<size>x<size>.png
  const fileName = size === 32 ? "favicon.png" : `icon-${size}x${size}.png`;
  const outputPath = path.resolve(__dirname, `../public/${fileName}`);
  sharp(inputSvg)
    .resize(size, size)
    .png({ quality: 90 })
    .toFile(outputPath)
    .then(() => console.log(`Generated ${fileName}`))
    .catch((err) => console.error(err));
}
