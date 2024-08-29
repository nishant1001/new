const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // In-memory database for simplicity

// Initialize the database
db.serialize(() => {
    db.run(`
        CREATE TABLE requests (
            request_id TEXT PRIMARY KEY,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            completed_at TEXT
        )
    `);
    
    db.run(`
        CREATE TABLE images (
            image_id INTEGER PRIMARY KEY AUTOINCREMENT,
            request_id TEXT NOT NULL,
            product_name TEXT NOT NULL,
            input_url TEXT NOT NULL,
            output_url TEXT,
            status TEXT NOT NULL,
            FOREIGN KEY (request_id) REFERENCES requests(request_id)
        )
    `);
});

/**
 * Adds a new request to the database.
 * @param {string} requestId - The unique request ID.
 * @param {string} filePath - The path of the uploaded file (not used in this function).
 */
function addRequest(requestId, filePath) {
    const createdAt = new Date().toISOString();
    db.run("INSERT INTO requests (request_id, status, created_at) VALUES (?, ?, ?)", [requestId, 'Pending', createdAt], function(err) {
        if (err) {
            console.error(`Error adding request: ${err.message}`);
        }
    });
}

/**
 * Updates the status of a request in the database.
 * @param {string} requestId - The unique request ID.
 * @param {string} status - The new status of the request.
 */
function updateRequestStatus(requestId, status) {
    const completedAt = status === 'Completed' ? new Date().toISOString() : null;
    db.run("UPDATE requests SET status = ?, completed_at = ? WHERE request_id = ?", [status, completedAt, requestId], function(err) {
        if (err) {
            console.error(`Error updating request status: ${err.message}`);
        }
    });
}

/**
 * Adds a new image record to the database.
 * @param {string} requestId - The unique request ID.
 * @param {string} productName - The name of the product.
 * @param {string} inputUrl - The URL of the input image.
 * @param {string} outputUrl - The URL of the processed image (optional).
 * @param {string} status - The status of the image processing.
 */
function addImage(requestId, productName, inputUrl, outputUrl, status) {
    db.run("INSERT INTO images (request_id, product_name, input_url, output_url, status) VALUES (?, ?, ?, ?, ?)", [requestId, productName, inputUrl, outputUrl, status], function(err) {
        if (err) {
            console.error(`Error adding image record: ${err.message}`);
        }
    });
}

/**
 * Retrieves the status of a request from the database.
 * @param {string} requestId - The unique request ID.
 * @returns {Promise<string>} - A promise that resolves to the status of the request.
 */

function getRequestStatus(requestId) {
    return new Promise((resolve, reject) => {
        db.get("SELECT status FROM requests WHERE request_id = ?", [requestId], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row ? row.status : 'Not Found');
            }
        });
    });
}

function saveRequestData(requestId, filePath) {
    const createdAt = new Date().toISOString();
    db.run("INSERT INTO requests (request_id, status, created_at) VALUES (?, ?, ?)", [requestId, 'Pending', createdAt]);
}


function updateRequestStatus(requestId, status) {
    const completedAt = status === 'Completed' ? new Date().toISOString() : null;
    return new Promise((resolve, reject) => {
        db.run("UPDATE requests SET status = ?, completed_at = ? WHERE request_id = ?", [status, completedAt, requestId], function(err) {
            if (err) {
                console.error(`Error updating request status: ${err.message}`);
                return reject(err);
            }
            resolve();
        });
    });
}

module.exports = { addRequest, updateRequestStatus, addImage, getRequestStatus, saveRequestData };
