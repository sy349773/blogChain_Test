var cloudinary = require("cloudinary"); // cloudinary...
/**
*Setting up cloudinary
*/
cloudinary.config({
  cloud_name: 'sy349773',
  api_key: '481619294194919',
  api_secret: 'SaEz0J3KNMvoRMN75L8CZbFFi0E',
  secure: true
});

//export it... only used in blogs...
 module.exports = cloudinary;
