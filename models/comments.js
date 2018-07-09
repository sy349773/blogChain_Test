/**
*Get all dependecies
*/
var mongoose = require("mongoose");
/**
*Create Schema
* The user should have text, date, and information about the Author for Identification for authorized delition
*/
var commentSchema = mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});
/**
*Export it
*/
module.exports = mongoose.model("Comments", commentSchema);
