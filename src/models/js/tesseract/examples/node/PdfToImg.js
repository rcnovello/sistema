/*
var pdf2img = require('pdf-img-convert');

// Both HTTP and local paths are supported
//var outputImages1 = pdf2img.convert('http://www.example.com/pdf_online.pdf');
var outputImages2 = pdf2img.convert('TESTE_EEG_ARQUIVO_REDE_LOCAL.pdf');

// From here, the images can be used for other stuff or just saved if that's required:

var fs = require('fs');

outputImages2.then(function(outputImages) {
    for (i = 0; i < outputImages.length; i++)
        fs.writeFile("output"+i+".png", outputImages[i], function (error) {
          if (error) { console.error("Error: " + error); }
        });
    });

    */