#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');
const Tesseract = require('tesseract.js');
const { createWorker } = require('../../');

//const pdfPath = 'TESTE_EEG_ARQUIVO_REDE_LOCAL.pdf';
const pdfPath = 'test.pdf';

fs.readFile(pdfPath, async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    //console.log(data);


    try {
        // Parse PDF to extract text content
        const pdfData = await pdf(data);
    
        // Get text content from pdf-parse
        //const textContent = pdfData.text;

        //console.log(JSON.stringify(pdfData));


        const worker = await createWorker();
        const { data: { text } } = await worker.recognize(Tesseract.data, {
            lang: 'eng', // Language code (e.g., 'eng' for English)
        });

        console.log(text);
        //fs.writeFileSync('tesseract-ocr-result.pdf', Buffer.from(pdf));
        //console.log('Generate PDF: tesseract-ocr-result.pdf');
        await worker.terminate();
        


    /*
        // Perform OCR on the text content
        const { data: { text } } = await Tesseract.recognize(data, {
          lang: 'eng', // Language code (e.g., 'eng' for English)
        });
    
      */  
        // Output the recognized text
        //console.log('Recognized Text:', text);
        

      } catch (error) {

        console.error(error);

      }


});

/*

const [,, imagePath] = process.argv;
const image = path.resolve(__dirname, (imagePath || '../../tests/assets/images/cosmic.png'));

console.log(`Recognizing ${image}`);

(async () => {
  const worker = await createWorker();
  const { data: { text, pdf } } = await worker.recognize(image, {pdfTitle: "Example PDF"}, {pdf: true});
  console.log(text);
  fs.writeFileSync('tesseract-ocr-result.pdf', Buffer.from(pdf));
  console.log('Generate PDF: tesseract-ocr-result.pdf');
  await worker.terminate();
})();
*/