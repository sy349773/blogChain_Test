/**
*Dependecies...
*/
var multer = require('multer'); // Required to send Files... images
//var request = require('request'); // same as above

/**
 * THIS CODE HAS BEEN REFERENCED // need all this code to upload images...
 * ref: https://github.com/expressjs/multer/issues/302
 * */
//file uploading via routing in htmlform
var storage = multer.diskStorage({
 filename: function(req, file, callback) {
   callback(null, Date.now() + file.originalname);
 }
});

//never used as we take care of it in the HTML form
var imageFilter = function (req, file, cb) {
   // accept image files only
   if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
       return cb(new Error('Only image files are allowed!'), false);
   }
   cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})
/**
 * END OF REFERENCE
 * */
//Export it...Only use in blogs...
 module.exports = upload;
