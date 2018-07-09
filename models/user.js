/**
*Get all dependecies
*/
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

/**
*Create Schema
* The user should have Name and a Password
*/
var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
/**
*For verification since verification depends on user id
*/
UserSchema.plugin(passportLocalMongoose)
/**
*Export it
*/
module.exports = mongoose.model("User", UserSchema);
