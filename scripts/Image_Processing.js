'use strict';

/**
 * Represents a picture object with properties and methods for image processing and manipulation.
 * @class
 */
class Picture {
    /**
     * Creates a picture object with properties and methods for image processing and manipulation.
     * @constructor
     * @param {number} px - The X-coordinate of the picture.
     * @param {number} py - The Y-coordinate of the picture.
     * @param {number} w - The width of the picture.
     * @param {number} h - The height of the picture.
     * @param {string} impath - The path to the image file.
     * @param {string} cat - The category of the picture.
     */
    constructor(px, py, w, h, impath, cat) {
        this.posx = px; // X-coordinate of the picture
        this.posy = py; // Y-coordinate of the picture
        this.w = w;     // Width of the picture
        this.h = h;     // Height of the picture
        this.impath = impath; // Path to the image file
        this.imgobj = new Image(); // Image object
        this.imgobj.src = this.impath; // Set the image source
        this.original_w = this.imgobj.width; // Original width of the image
        this.original_h = this.imgobj.height; // Original height of the image
        this.category = cat; // Category of the picture
        this.hist = []; // Array to store histogram data
        this.color_moments = []; // Array to store color moments data
        this.manhattanDist = []; // Array to store Manhattan distances
    }

    /**
     * Draws the image on the canvas.
     * @param {HTMLCanvasElement} cnv - The canvas element to draw the image on.
     */
    draw(cnv) {
        let ctx = cnv.getContext("2d");

        if (this.imgobj.complete) {
            ctx.drawImage(this.imgobj, this.posx, this.posy, this.w, this.h);
            console.log("Debug: N Time");

        } else {
            console.log("Debug: First Time");
            let self = this;
            this.imgobj.addEventListener('load', function () {
                ctx.drawImage(self.imgobj, self.posx, self.posy, self.w, self.h);
            }, false);
        }
    }

    /**
     * This method performs image processing on a canvas element, including drawing the image, counting pixels, and dispatching an event.
     * @param {HTMLCanvasElement} cnv - The canvas element to perform image processing on.
     * @param {Object} histcol - An object containing color histogram data.
     * @param {Object} colorMom - An object containing color moment data.
     * @param {Event} eventP - The event to dispatch after image processing is complete.
     */
    computation(cnv, histcol, colorMom, eventP) {        
        //Method to apply algorithms to the image and trigger an event when processed
        //Because the image have to loaded from the server, the same strategy used in the method draw()
        //is used here to access the image pixels. We do not know exactly when the image in loaded and computed.
        //For this reason the event "processed_picture" was created to alert the application (ISearchEngine)
        
        const ctx = cnv.getContext("2d");

        if (this.imgobj.complete) {
            console.log("Debug: N Time");
            ctx.drawImage(this.imgobj, 0, 0, this.imgobj.width, this.imgobj.height);

            const pixels = ctx.getImageData(0, 0, this.imgobj.width, this.imgobj.height);

            this.hist = histcol.count_Pixels(pixels);

            document.dispatchEvent(eventP);

            ctx.clearRect(0,0,cnv.width,cnv.height);

        } else {
            console.log("Debug: First Time");
            const self = this;
            this.imgobj.addEventListener('load', function () {
                ctx.drawImage(self.imgobj, 0, 0, self.imgobj.width, self.imgobj.height);
                
                const pixels = ctx.getImageData(0, 0, self.imgobj.width, self.imgobj.height);

                self.hist = histcol.count_Pixels(pixels);

                document.dispatchEvent(eventP);

                ctx.clearRect(0,0,cnv.width,cnv.height);
            }, false);
        }
    }

    /**
     * Draws color rectangles and their corresponding histogram values on a canvas.
     * @param {HTMLCanvasElement} cnv - The canvas element to draw on.
     * @param {number[]} hist - An array of histogram values.
     * @param {number[]} redColor - An array of red color values.
     * @param {number[]} greenColor - An array of green color values.
     * @param {number[]} blueColor - An array of blue color values.
     */
    build_Color_Rect(cnv, hist, redColor, greenColor, blueColor) {
        // Method for debugging, shows color and the corresponding number of pixels obtained by the colorHistogram algorithm
        const ctx = cnv.getContext("2d");
        const text_y = 390;
        const rect_y = 400;
        const hor_space = 80;

        ctx.font = "12px Arial";
        for (let c = 0; c < redColor.length; c++) {
            ctx.fillStyle = "rgb(" + redColor[c] + "," + greenColor[c] + "," + blueColor[c] + ")";
            ctx.fillRect(c * hor_space, rect_y, 50, 50);
            if (c === 8) {
                ctx.fillStyle = "black";
            }
            ctx.fillText(hist[c], c * hor_space, text_y);
        }
    }

    /**
     * Sets the position of the image.
     * @param {number} px - The x-coordinate of the image position.
     * @param {number} py - The y-coordinate of the image position.
     */
    setPosition(px, py) {
        this.posx = px;
        this.posy = py;
    }

    /**
     * Checks if the given mouse coordinates are within the bounds of the image.
     * @param {number} mx - The x-coordinate of the mouse.
     * @param {number} my - The y-coordinate of the mouse.
     * @returns {boolean} - True if the mouse is within the bounds of the image, false otherwise.
     */
    mouseOver(mx, my) {
        if ((mx >= this.posx) && (mx <= (this.posx + this.w)) && (my >= this.posy) && (my <= (this.posy + this.h))) {
            return true;
        }
        return false;
    }
}

/**
 * Class to compute the Color Histogram algorith. 
 * It receives the colors and computes the histogram through the method count_Pixels()
 * @class
 */
class ColorHistogram {
    /**
     * Creates an instance of class ColorHistogram.
     * @constructor
     * @param {Array} redColor - Array representing red color values.
     * @param {Array} greenColor - Array representing green color values.
     * @param {Array} blueColor - Array representing blue color values.
     */
    constructor(redColor, greenColor, blueColor) {
        this.redColor = redColor; // Array representing red color values
        this.greenColor = greenColor; // Array representing green color values
        this.blueColor = blueColor; // Array representing blue color values
        // This class is expected to be completed by the students
        this.thresholdTotal = 150;
        this.thresholdRGB = 75;
    }

    /**
     * Method to compute the color histogram from a given set of pixels
     * 
     * @param {Array} pixels - The array of pixels in the image.
     * @returns {Array} Rhe color histogram from a given set of pixels.
     */
    count_Pixels(pixels) {
        let Histogram = Array(12).fill(0);

        for(let idx = 0; idx < pixels.data.length; idx += 4){
            let redPxl = pixels.data[idx];
            let greenPxl = pixels.data[idx+1];
            let bluePxl = pixels.data[idx+2];
            for(let j=0; j<12; j++){
                let dist;
                let redDiff = Math.abs(this.redColor[j] - redPxl);
                let greenDiff = Math.abs(this.greenColor[j] - greenPxl);
                let blueDiff = Math.abs(this.blueColor[j] - bluePxl);

                dist = redDiff + greenDiff + blueDiff;

                if(dist < this.thresholdTotal && redDiff < this.thresholdRGB && greenDiff < this.thresholdRGB && blueDiff < this.thresholdRGB){
                    Histogram[j] += 1;
                }
            }
        }
        
        //Normalizar as cores dos pixeis
        Histogram = Histogram.map(function(pixelColor){
            return pixelColor / (pixels.data.length / 4);
        });
        
        return Histogram;
    }
}

/**
 * Class to compute the Color Moments algorithm.
 * It computes the statistical moments through the method moments().
 * The moments are computed in the HSV color space, and the method rgbToHsv is used
 * to translate the pixel into the HSV color space.
 * @class
 */
class ColorMoments {
    /**
     * Creates an instance of ColorMoments.
     * @constructor
     */
    constructor() {
        this.h_block = 3; // Number of horizontal blocks
        this.v_block = 3; // Number of vertical blocks
    }

    /**
     * Converts RGB values to the HSV color space.
     * @param {number} rc - The red color value (0-255).
     * @param {number} gc - The green color value (0-255).
     * @param {number} bc - The blue color value (0-255).
     * @returns {number[]} An array representing the [h, s, v] values in the HSV color space.
     */
    rgbToHsv(rc, gc, bc) {
        // Convert RGB values to the HSV color space
        // This method returns an array representing the [h, s, v] values in the HSV color space
        let r = rc / 255;
        let g = gc / 255;
        let b = bc / 255;

        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let h = null, s = null, v = max;

        let dif = max - min;
        s = max == 0 ? 0 : dif / max;

        if (max == min) {
            h = 0;
        } else {
            switch (max) {
                case r:
                    h = (g - b) / dif + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / dif + 2;
                    break;
                case b:
                    h = (r - g) / dif + 4;
                    break;
            }
            h /= 6;
        }
        return [h, s, v];
    }

    /**
     * Calculates the color moments of an image.
     * @param {HTMLImageElement} imgobj - The image to calculate the color moments from.
     * @param {HTMLCanvasElement} cnv - The canvas element to draw the image on.
     * @returns {Array} An array containing the computed color moments.
     */
    moments(imgobj, cnv) {
        // Calculate the dimensions of each block
        const wBlock = Math.floor(imgobj.width / this.h_block);
        const hBlock = Math.floor(imgobj.height / this.v_block);

        // Calculate the total number of blocks
        const n = this.h_block * this.v_block;

        // Array to store the computed color moments
        const descriptor = [];

        // Get the 2D rendering context of the canvas
        let ctx = cnv.getContext("2d");
        // Draw the image on the canvas
        ctx.drawImage(imgobj, 0, 0);

        // this method should be completed by the students

        return descriptor;
    }
}
