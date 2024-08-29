// // index.js
// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const { processImages } = require('./imageProcessor');

// const app = express();
// const PORT = 3000;

// const upload = multer({ dest: 'uploads/' });

// app.use(express.json());

// app.post('/upload-csv', upload.single('file'), async (req, res) => {
//     const csvFilePath = req.file.path;
//     console.log(`Received CSV file: ${csvFilePath}`);
    
//     try {
//         await processImages(csvFilePath);
//         res.send('CSV processed successfully');
//     } catch (error) {
//         console.error(`Error processing CSV: ${error.message}`);
//         res.status(500).send('Error processing CSV');
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync'); 
const { generateUniqueId } = require('./utils');
const { processImages } = require('./imageProcessor');
const { saveRequestData, getRequestStatus, addRequest, updateRequestStatus } = require('./database');

const app = express();
const PORT = 3000;

const upload = multer({ dest: 'uploads/' });

app.use(express.json());

// Upload and process CSV
app.post('/upload-csv', upload.single('file'), async (req, res) => {
    const csvFilePath = req.file.path;
    console.log(`Received CSV file: ${csvFilePath}`);

    const requestId = generateUniqueId();
    try {
        const csvData = await parse(csvFilePath);
        await saveRequestData(requestId);

        // Start processing images asynchronously
        processImages(requestId, csvFilePath)
            .then(() => {
                updateRequestStatus(requestId, 'Completed');
            })
            .catch((error) => {
                console.error(`Error processing images: ${error.message}`);
                updateRequestStatus(requestId, 'Failed');
            });

        res.json({ requestId });
    } catch (error) {
        console.error(`Error processing CSV: ${error.message}`);
        res.status(500).send('Error processing CSV');
    }
});

// Check processing status
app.get('/status/:requestId', async (req, res) => {
    const { requestId } = req.params;
    try {
        const status = await getRequestStatus(requestId);
        if (status) {
            res.json({ status });
        } else {
            res.status(404).send('Request ID not found');
        }
    } catch (error) {
        console.error(`Error fetching status: ${error.message}`);
        res.status(500).send('Error fetching status');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});