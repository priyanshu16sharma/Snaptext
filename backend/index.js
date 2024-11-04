const express = require('express');
const app = express();
const cv = require('opencv.js');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const cors = require("cors");
const { Canvas, createCanvas, Image, ImageData, loadImage } = require('canvas');
const { JSDOM } = require('jsdom');
const { writeFileSync, existsSync, mkdirSync } = require("fs");
const { cleanDate, cleanField } = require('./helperFunctions');

const createWorker = Tesseract.createWorker;
app.use(express.json({ limit: '10mb' }));
app.use(express.json());
app.use(cors());





  (async()=>{
    installDOM();
  })()
  function installDOM() {
    const dom = new JSDOM();
    global.document = dom.window.document;
    global.Image = Image;
    global.HTMLCanvasElement = Canvas;
    global.ImageData = ImageData;
    global.HTMLImageElement = Image;
  }

  async function preprocessImageForOCR() {

    const inputPath = './temp/input-image.png';
    const processedPath = './temp/processed-image.png';
    const image = await loadImage(inputPath);
    const src = cv.imread(image); 
    
    // Resize image to double its size 
    const resized = new cv.Mat();
    cv.resize(src, resized, new cv.Size(src.cols * 2, src.rows * 2), 0, 0, cv.INTER_LINEAR);
    
    let gray = new cv.Mat();
  cv.cvtColor(resized, gray, cv.COLOR_BGR2GRAY);

  // Initialize rectangular and square structuring kernels
  const rectKernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(25, 7));
  const sqKernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(21, 21));

  // Smooth the image 
  const blurred = new cv.Mat();
  cv.GaussianBlur(gray, blurred, new cv.Size(3, 3), 0);

  // to find dark regions on a light background
  const blackhat = new cv.Mat();
  cv.morphologyEx(blurred, blackhat, cv.MORPH_BLACKHAT, rectKernel);

  // Optional: Mild dilation with a small kernel to improve OCR on faint text
  const dilated = new cv.Mat();
  const kernel = cv.Mat.ones(2, 2, cv.CV_8U); 
  cv.dilate(blackhat, dilated, kernel, new cv.Point(-1, -1), 1);

    // canvas for resultant image
    const canvas = createCanvas(dilated.cols, dilated.rows);
    cv.imshow(canvas, dilated); 

    // Save the processed image 
    writeFileSync(processedPath, canvas.toBuffer('image/png')); // Use PNG for higher quality

    
    resized.delete();
    gray.delete();
    blurred.delete();
    rectKernel.delete();
    sqKernel.delete();
    blackhat.delete();
    src.delete();
    dilated.delete();
  }


  app.post('/api/process-image/passport', async (req, res) => {
      const { image } = req.body;
      const buffer = Buffer.from(image, 'base64');
    
      
      const inputPath = './temp/input-image.png';
      const processedPath = './temp/processed-image.png';
    
      try {
        fs.writeFileSync(inputPath, buffer);
    
        await preprocessImageForOCR();
          
        // Run OCR on the processed image
        console.log("Tesseract");
        const worker = await createWorker('eng', 1, {
          logger: m => console.log(m), // Add logger here
        });
        
        
          let { data: { text } } = await worker.recognize(processedPath);
          console.log(text);
          const text1 = [];

          const lines = text.split('\n'); 
          
          for (let lin of lines) {
              let s = lin.trim(); 
              s = s.replace('\n', ''); // Remove newline characters (though trim will handle this)
              text1.push(s); 
          }


          const extractedData = {};
          text1.forEach((line, index) => {
            if (/Passport No/i.test(line)) {
              extractedData.passport_number = cleanField(text1[index + 1].match(/\d+/)[0]);
            }
            if (/Sumname\/Nom/i.test(line)) {
              extractedData.surname = cleanField(text1[index + 1].trim());
            }
            if (/Given names\/Prénoms/i.test(line)) {
              extractedData.given_names = cleanField(text1[index + 1].trim());
            }
            if (/Nationality\/Nationalité/i.test(line)) {
              extractedData.nationality = cleanField(text1[index + 1].replace(/[^A-Z ]+/gi, '').trim());
            }
            if (/Date de naissance/i.test(line)) {
              extractedData.date_of_birth = cleanDate(text1[index + 1].trim());
            }
            if (/Sex\/Sexe/i.test(line)) {
              extractedData.sex = cleanField(text1[index + 1].includes('M') ? 'M' : 'F');
            }
            if (/Lieu de naissance/i.test(line)) {
              extractedData.place_of_birth = cleanField(text1[index + 1].trim());
            }
            if (/Date de délivrance/i.test(line)) {
              extractedData.date_of_issue = cleanDate(text1[index + 1].trim());
            }
            
            if (/expiration/i.test(line)) {
              extractedData.date_of_expiry = cleanDate(text1[index + 1].trim());
            }
          });


          await worker.terminate();
        
          res.status(200).send({data: extractedData})
        
      } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Image processing failed' });
      } finally {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(processedPath);
      }   
    });

  app.listen(3001, ()=>{
      console.log("running on port 3001")
  });