const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const sharp = require('sharp');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

async function downloadImage(url, outputPath) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch image');

        const buffer = await response.buffer();
        ensureDirectoryExistence(outputPath); // Ensure the directory exists
        fs.writeFileSync(outputPath, buffer);
        console.log(`Image downloaded to ${outputPath}`);
    } catch (error) {
        console.error(`Error downloading image: ${error.message}`);
    }
}

async function compressImage(inputPath, outputPath) {
    try {
        ensureDirectoryExistence(outputPath); // Ensure the directory exists

        await sharp(inputPath)
            .resize({ width: 800 }) 
            .jpeg({ quality: 50 }) 
            .toFile(outputPath);

        console.log(`Image compressed and saved to ${outputPath}`);
    } catch (error) {
        console.error(`Error compressing image: ${error.message}`);
    }
}

async function processImages(requestId, csvPath) {
    try {
        console.log(`Processing CSV file: ${csvPath}`);
        const csvData = fs.readFileSync(csvPath);
        const records = parse(csvData, { columns: true });

        const outputDir = path.join(__dirname, 'downloads', requestId); // Use requestId in the directory structure
        ensureDirectoryExistence(outputDir); // Ensure the output directory exists

        for (const row of records) {
            if (!row['Input Image Urls']) {
                console.log('No image URLs found in row:', row);
                continue;
            }

            const imageUrls = row['Input Image Urls'].split(',');
            const compressedUrls = [];

            for (const url of imageUrls) {
                const fileName = path.basename(new URL(url).pathname);
                const downloadPath = path.join(outputDir, fileName);
                const compressedPath = path.join(outputDir, `compressed-${fileName}`);

                console.log(`Downloading image from ${url}`);
                await downloadImage(url, downloadPath);

                console.log(`Processing image ${downloadPath}`);
                await compressImage(downloadPath, compressedPath);

                compressedUrls.push(`https://your-storage-url/${path.basename(compressedPath)}`);
            }

            row['Output Image Urls'] = compressedUrls.join(',');
        }

        const outputCsv = stringify(records, { header: true });
        fs.writeFileSync(path.join(__dirname, 'output.csv'), outputCsv);

        console.log('Output CSV generated at ' + path.join(__dirname, 'output.csv'));
    } catch (error) {
        console.error(`Error processing images: ${error.message}`);
    }
}

function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        console.log(`Creating directory: ${dirname}`);
        fs.mkdirSync(dirname, { recursive: true });
    }
}

module.exports = {
    downloadImage,
    compressImage,
    processImages
};
