# Snaptext Backend

This repository contains the backend code for the Snapptext, a web application designed to process and extract information from document images, such as passports and IDs, using Optical Character Recognition (OCR) and image processing techniques.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Image Upload:** Users can upload images for processing.
- **OCR Processing:** Extracts text from images using Tesseract.js.
- **Image Preprocessing:** Utilizes OpenCV.js for image processing to enhance OCR accuracy.
- **Data Extraction:** Extracts relevant data fields such as passport number, names, nationality, and dates from processed images.
- **Modular Design:** Easily extendable and maintainable codebase with modular functions for each operation.

## Technologies Used
- **Node.js**: JavaScript runtime for server-side programming.
- **Express.js**: Web framework for building RESTful APIs.
- **Tesseract.js**: OCR library for text recognition.
- **OpenCV.js**: Computer vision library for image processing.
- **dotenv**: Module to load environment variables from a .env file.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/docuville-backend.git
   cd docuville-backend
2. Install Dependencies
   npm install
   Configuration
   **##Make sure to configure your environment variables in the .env file as needed. The PORT variable specifies the port on which the server will run.****

**Usage**
Start the server:

bash
Copy code
npm start
The server will run on http://localhost:3000.

**API Endpoints**

## POST /api/process-image/passport
Description: Accepts an image
Request Body: image in base64format
Response: JSON object containing extracted data.

Response Example
json
Copy code
{
  "passport_number": "123456789",
  "surname": "Doe",
  "given_names": "John",
  "nationality": "USA",
  "date_of_birth": "1990-01-01",
  "sex": "M",
  "place_of_birth": "City, State",
  "date_of_issue": "2020-01-01",
  "date_of_expiry": "2030-01-01"
}
