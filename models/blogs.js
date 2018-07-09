/**
*Get all dependecies
*/
var mongoose = require("mongoose");

/**
*Create Schema
* The Blog should have Title, content, date, information about the author Identification for authorized deletion and information about the comments
*NOTE: comments have also info about the author for proper authrized deletion.
*/
var blogSchema = new mongoose.Schema({
   name: String,
   content: String,
   createdAt: { type: Date, default: Date.now },
   imageID: String,
   imageURL: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comments"
      }
   ]
});
/**
*Export it
*/
module.exports = mongoose.model("Blogs", blogSchema);
