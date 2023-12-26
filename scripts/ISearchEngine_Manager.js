'use strict';

//Declaring a global variable which will be created in main function 
let app = null;

/**
 * The main function that initializes the application.
 */
function main() {
    const canvas = document.querySelector("canvas");

    //Creating the instance of the application
    app = new ISearchEngine("database.json");

    // Initializing the app
    app.init(canvas);
}

/**
 * Function that generates an artificial image and draw it in canvas.
 * Useful to test the image processing algorithms.
 * 
 * @param {HTMLCanvasElement} canvas - The canvas element to draw the image on.
 * @returns {ImageData} - The generated image data.
 */
function Generate_Image(canvas) {
    const ctx = canvas.getContext("2d");
    const imgData = ctx.createImageData(100, 100);

    for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i + 0] = 204;
        imgData.data[i + 1] = 0;
        imgData.data[i + 2] = 0;
        imgData.data[i + 3] = 255;
        if ((i >= 8000 && i < 8400) || (i >= 16000 && i < 16400) || (i >= 24000 && i < 24400) || (i >= 32000 && i < 32400))
            imgData.data[i + 1] = 200;
    }
    ctx.putImageData(imgData, 150, 0);
    return imgData;
}