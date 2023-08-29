const tinify = require("tinify");
const yargs = require("yargs");
const fs = require("fs");
const path = require("path");

const ACCEPTED_FILE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".svg",
  ".webp",
  ".ico",
  ".tiff",
  ".tif",
];

// Consume command line args
const argv = yargs
  .option("apiKey", {
    alias: "k",
    description: "Your TinyPNG API key",
    demandOption: true,
  })
  .option("fileName", {
    alias: "f",
    description: "Name of file to compress",
    demandOption: false,
  })
  .option("inputDir", {
    alias: "i",
    description: "Input directory for image files - (absolute path)",
    demandOption: true,
  })
  .option("outputDir", {
    alias: "o",
    description:
      "Output directory for compressed image files - (absolute path)",
    demandOption: true,
  })
  .option("entireDirectory", {
    alias: "e",
    description: "Your TinyPNG API key",
    demandOption: true,
  })
  .check((argv) => {
    if (!argv.entireDirectory && !argv.fileName) {
      throw new Error(
        "If not compressing the entire directory, --fileName is required."
      );
    }
    return true;
  })
  .help()
  .alias("help", "h").argv;

const { apiKey, fileName, inputDir, outputDir, entireDirectory } = argv;

// Set the tinify api key from the args
tinify.key = apiKey;

// Compress image
const compressImage = async (fileName, _inputDir, _outputDir) => {
  try {
    console.log(`Compressing image ${fileName}...`);

    const inputPath = `${_inputDir}/${fileName}`;
    const outputPath = `${_outputDir}/${fileName}`;

    const source = await tinify.fromFile(inputPath);

    await source.toFile(outputPath);

    console.log(`Successfully compressed image ${fileName}`);
  } catch (error) {
    console.error(`Failed to compress image. Error: ${error.message}`);
  }
};

// Create list of all files in a directory that can be compressed
const readDirectory = (directoryPath) => {
  try {
    console.log("Scanning directory for images");
    const files = fs.readdirSync(directoryPath);

    const fileNames = files.reduce((acc, item) => {
      const itemPath = path.join(directoryPath, item);
      const stat = fs.statSync(itemPath);

      // Check if directory item is a file
      if (stat.isFile()) {
        // Get the file extension
        const ext = path.extname(item);

        // Ensure the extension is permissible
        if (ACCEPTED_FILE_EXTENSIONS.includes(ext)) acc.push(item);
      }

      return acc;
    }, []);

    console.log(`Found ${fileNames.length} images`);
    fileNames?.forEach((image, i) => console.log(`${i + 1}. ${image}`));

    return fileNames;
  } catch (error) {
    console.error("Error reading directory:", error);
  }
};

if (JSON.parse(entireDirectory)) {
  const fileNames = readDirectory(inputDir);

  Promise.allSettled(
    fileNames.map((name) => compressImage(name, inputDir, outputDir))
  );
} else {
  compressImage(fileName, inputDir, outputDir);
}
