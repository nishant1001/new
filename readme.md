# {Assignment} ImageProcessor CSV Manager

### **Description**

The **ImageProcessor CSV Manager** is a Node.js application designed to handle CSV file uploads, process image URLs, and manage request statuses. It supports downloading, compressing, and managing images. The application provides endpoints for uploading CSV files and checking processing statuses.

### **Features**

- **CSV Upload and Processing:** Upload CSV files containing image URLs for processing.
- **Image Management:** Download, compress, and update image URLs.
- **Status Tracking:** Check the processing status of requests.

### **Installation**

#### **Clone the Repository**

Clone the repository to your local machine:
`git clone https://github.com/nishant1001/new.git`

After cloning, move into the repository's directory with the cd command:
`cd new`


#### **Install Dependencies**

Install the required dependencies using npm: `npm install`


### **Usage**

#### **Start the Server**

To start the server, run: `npm start`


#### **API Endpoints**

##### **POST /upload-csv**

Upload a CSV file for processing. The CSV should contain columns for `Serial Number`, `Product Name`, `Input Image Urls`.

**Request:**

- **Body:** Form-data with `file` containing the CSV.

**Response:**

- Returns a JSON object with a `requestId`.

**Example:**

curl -X POST http://localhost:3000/upload-csv
-F "file=@path/to/your/file.csv"


##### **GET /status/:requestId**

Retrieve the processing status for a given `requestId`.

**Request:**

- **Path Parameter:** `requestId` - The unique identifier for the request.

**Response:**

- Returns a JSON object with the `status` of the request.

**Example:**

curl http://localhost:3000/status/<requestId>


### **Code Explanation**

#### **Server Setup**

The server is built using `express` and listens on port 3000. It handles CSV uploads and status checks.

#### **CSV Upload and Processing**

- **Endpoint `/upload-csv`:** Receives a CSV file, processes it asynchronously, and updates the request status.

#### **Image Processing**

- **Function `processImages`:** Downloads images from URLs specified in the CSV file, compresses them using `sharp`, and updates the CSV with the URLs of the compressed images.

### **Dependencies**

- **axios:** Promise-based HTTP client for making requests.
- **csv-parse:** CSV parser library.
- **csv-stringify:** CSV stringifier library.
- **express:** Web framework for Node.js.
- **multer:** Middleware for handling `multipart/form-data`, used for file uploads.
- **node-fetch:** HTTP client for Node.js.
- **sharp:** Image processing library.
- **uuid:** UUID generation library.

### **Contributing**

Contributions are welcome! Please fork the repository and submit a pull request with your changes. Ensure that your contributions adhere to the project's coding standards and include appropriate tests.

### **License**

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

### **Contact**

For any questions or issues, please contact [nishantk1001@gmail.com](mailto:nishantk1001@gmail.com)

