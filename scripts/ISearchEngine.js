'use strict';

/**
 * Represents a search engine for images.
 * @class
 */
class ISearchEngine {
    /**
     * Creates a new instance of the ISearchEngine class.
     * @param {string} dbase - The name of the JSON file with the information related to the images.
     */
    constructor(dbase) {
        //Pool to include all the objects (mainly pictures) drawn in canvas 
        this.allpictures = new Pool(3000);

        //Array of color to be used in image processing algorithms
        this.colors = ["red", "orange", "yellow", "green", "Blue-green", "blue", "purple", "pink", "white", "grey", "black", "brown"];

        // Red component of each color
        this.redColor = [204, 251, 255, 0, 3, 0, 118, 255, 255, 153, 0, 136];
        // Green component of each color
        this.greenColor = [0, 148, 255, 204, 192, 0, 44, 152, 255, 153, 0, 84];
        // Blue component of each color
        this.blueColor = [0, 11, 0, 0, 198, 255, 167, 191, 255, 153, 0, 24];

        //List of categories available in the image database
        this.categories = ["beach", "birthday", "face", "indoor", "manmade/artificial", "manmade/manmade", "manmade/urban", "marriage", "nature", "no_people", "outdoor", "party", "people", "snow"];

        //Name of the JSON file with the information related to the images 
        this.jsonFile = dbase;

        // Instance of the Database class to manage the information in the JSON file 
        this.db = new DatabaseJSON();

        // Instance of the LocalStorageDatabase class to manage the information in the LocalStorage 
        this.lsDb = new LocalStorageDatabaseJSON();

        //Number of images per category for image processing
        this.numImages = 1;
        //Number of images to show in canvas as a search result
        this.numShownPic = 35;

        //Width of image in canvas
        this.imgWidth = 190;
        //Height of image in canvas
        this.imgHeight = 140;
    }

    /**
     * Initializes the search engine and the canvas.
     * First stage it is used to process all the images.
     * @param {Canvas} cnv - The canvas element.
     */
    init(cnv) {
        this.databaseProcessing(cnv);

    }

    /**
     * Performs database processing for image search.
     * @param {CanvasRenderingContext2D} cnv - The canvas rendering context.
     */
    databaseProcessing(cnv) {
        // method to build the database which is composed by all the pictures organized by the JSON database file
        // At this initial stage, in order to evaluate the image algorithms, the method only compute one image.
        // However, after the initial stage the method must compute all the images in the JSON file

        //Images processing classes
        const h12color = new ColorHistogram(this.redColor, this.greenColor, this.blueColor);
        const colmoments = new ColorMoments();

        //Creating an event that will be used to understand when image is already processed
        const eventname = "processed_picture_" + img.impath;
        const eventP = new Event(eventname);
        const self = this;
        document.addEventListener(eventname, function () {
            //self.imageProcessed(img, eventname);
        }, false);

        img.computation(cnv, h12color, colmoments, eventP);
    }

    /**
     * Processed the given image and performs necessary operations.
     * @param {Image} img - The image to be processed.
     * @param {string} eventname - The name of the event triggered during image processing.
     */
    imageProcessed(img, eventname) {
        //When the event "processed_picture_" is enabled this method is called to check if all the images are
        //already processed. When all the images are processed, a database organized in JSON is saved in the localStorage
        //to answer the queries related to Color and Image Example

        this.allpictures.insert(img);
        console.log("image processed " + this.allpictures.stuff.length + eventname);
        if (this.allpictures.stuff.length === (this.numImages * this.categories.length)) {
            //this.createColorDatabaseLS();
            //this.createIExampledatabaseLS();
        }
    }

    /**
     * Creates a color database using Local Storage.
     */
    createColorDatabaseLS() {
        //Method to create the JSON database in the localStorage for color queries
        // this method should be completed by the students
    }

    /**
     * Creates an example database for image search.
     * This method should be completed by the students.
     */
    createIExampledatabaseLS() {
        //Method to create the JSON database in the localStorage for Image Example queries

        const list_images = new Pool(this.allpictures.stuff.length);
        this.zscoreNormalization();

        // this method should be completed by the students
    }

    /**
     * Performs z-score normalization on the color moments of the pictures.
     */
    zscoreNormalization() {
        //A good normalization of the data is very important to look for similar images. This method applies the
        //zscore normalization to the data

        const overall_mean = [];
        const overall_std = [];

        // Inicialization
        for (let i = 0; i < this.allpictures.stuff[0].color_moments.length; i++) {
            overall_mean.push(0);
            overall_std.push(0);
        }

        // Mean computation I
        for (let i = 0; i < this.allpictures.stuff.length; i++) {
            for (let j = 0; j < this.allpictures.stuff[0].color_moments.length; j++) {
                overall_mean[j] += this.allpictures.stuff[i].color_moments[j];
            }
        }

        // Mean computation II
        for (let i = 0; i < this.allpictures.stuff[0].color_moments.length; i++) {
            overall_mean[i] /= this.allpictures.stuff.length;
        }

        // STD computation I
        for (let i = 0; i < this.allpictures.stuff.length; i++) {
            for (let j = 0; j < this.allpictures.stuff[0].color_moments.length; j++) {
                overall_std[j] += Math.pow((this.allpictures.stuff[i].color_moments[j] - overall_mean[j]), 2);
            }
        }

        // STD computation II
        for (let i = 0; i < this.allpictures.stuff[0].color_moments.length; i++) {
            overall_std[i] = Math.sqrt(overall_std[i] / this.allpictures.stuff.length);
        }

        // zscore normalization
        for (let i = 0; i < this.allpictures.stuff.length; i++) {
            for (let j = 0; j < this.allpictures.stuff[0].color_moments.length; j++) {
                this.allpictures.stuff[i].color_moments[j] = (this.allpictures.stuff[i].color_moments[j] - overall_mean[j]) / overall_std[j];
            }
        }
    }

    /**
     * Searches for images based on the specified category and color.
     * @param {string} category - The category of the images to search for.
     * @param {string} color - The color of the images to search for.
     */
    searchColor(category, color) {
        //Method to search images based on a selected color

        // this method should be completed by the students
    }

    /**
     * Searches for images based on the provided category.
     * @param {string} category - The category to search for.
     */
    searchKeywords(category) {
        //Method to search images based on keywords

        // this method should be completed by the students
    }

    /**
     * Searches for images with similarity to the given example.
     * @param {ImageData} IExample - The example image to compare against.
     * @param {number} dist - The distance threshold for similarity.
     */
    searchISimilarity(IExample, dist) {
        //Method to search images based on Image similarities
        //this method should be completed by the students
    }


    /**
     * Calculates the Manhattan distance between two images based on their color moments.
     * @param {Object} img1 - The first image object.
     * @param {Object} img2 - The second image object.
     * @returns {number} The calculated Manhattan distance.
     */
    calcManhattanDist(img1, img2) {
        //Method to compute the Manhattan difference between 2 images which is one way of measure the similarity
        //between images.
        let manhattan = 0;

        for (let i = 0; i < img1.color_moments.length; i++) {
            manhattan += Math.abs(img1.color_moments[i] - img2.color_moments[i]);
        }
        manhattan /= img1.color_moments.length;
        return manhattan;
    }

    /**
     * Sorts the given list of image by their Manhattan distance based on the provided index-distance mapping.
     * @param {Object} idxdist - The index-distance mapping.
     * @param {Array} list - The list of items to be sorted.
     */
    sortbyManhattanDist(idxdist, list) {
        //Method to sort images according to the Manhattan distance measure
        //this method should be completed by the students
    }

    /**
     * Sorts the given list of images by the specified color index.
     * @param {number} idxColor - The index of the color to sort by.
     * @param {Array} list - The list of images to be sorted.
     */
    sortbyColor(idxColor, list) {
        //Method to sort images according to the number of pixels of a selected color
        list.sort(function (a, b) {
            return b.hist[idxColor] - a.hist[idxColor];
        });
    }

    /**
     * Renders the grid view of the search results on the canvas.
     *
     * @param {Canvas} canvas - The canvas element to render the grid view on.
     */
    gridView(canvas) {
        //Method to visualize images in canvas organized in columns and rows
        // this method should be completed by the students
    }

}

/**
 * Represents a pool of objects with a maximum size.
 */
class Pool {
    /**
     * Creates a new instance of Pool.
     * @param {number} maxSize - The maximum size of the pool.
     */
    constructor(maxSize) {
        this.size = maxSize;
        this.stuff = [];
    }

    /**
     * Inserts an object into the pool.
     * @param {any} obj - The object to be inserted.
     */
    insert(obj) {
        if (this.stuff.length < this.size) {
            this.stuff.push(obj);
        } else {
            alert("The application is full: there isn't more memory space to include objects");
        }
    }

    /**
     * Removes an object from the pool.
     * If there are no objects to delete, an alert message is displayed.
     */
    remove() {
        if (this.stuff.length !== 0) {
            this.stuff.pop();
        } else {
            alert("There aren't objects in the application to delete");
        }
    }

    /**
     * Empties the pool by removing all items.
     */
    empty_Pool() {
        while (this.stuff.length > 0) {
            this.remove();
        }
    }
}