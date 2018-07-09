/**
*Import local dependecies
*/
var Comments = require('../models/comments');
var Blogs = require('../models/blogs');
/**
*Create the authentication middleware and export it.
* 3 methods... One to check if the user is logged in, another to check the Author of the Blog and Another to check Author of the comments
*/
module.exports = {
  /**
  *Checks if the user is logged in
  * @req =  the object containg the information of the request
  * @res = ************************************** of the response
  * @next = The next function after this method is called
  */
  isUserLoggedIn: function(req, res, next){
      if(req.isAuthenticated()){ // if logged in
          return next(); // the next fucntion gets executed
      }
      req.flash('error', 'Please Sign In');
      res.redirect('/login');
  },
  /**
  *Check if the user is the author of the blog so no other user can update or delete the blog
  * @req =  the object containg the information of the request
  * @res = ************************************** of the response
  * @next = The next function after this method is called
  */
  checkAuthorBlog: function(req, res, next){
    Blogs.findById(req.params.id, function(err, foundBlog){
      if(err || !foundBlog){ // error or blog not found
          console.log(err); // print the error
          req.flash('error', 'Sorry, this blog no longer exist!'); // message
          res.redirect('/blogs'); // redirects to blogs
      } else if(foundBlog.author.id.equals(req.user._id)){ // if user is the author
          req.blog = foundBlog; //updates blog
          next(); // go on... to the next function
      }
    });
  },
  /**
  *Checks if the user is the author of the comment no other user can update or delete the comment
  * @req =  the object containg the information of the request
  * @res = ************************************** of the response
  * @next = The next function after this method is called
  */
  checkAuthorComment: function(req, res, next){
    Comments.findById(req.params.commentId, function(err, foundComment){
       if(err || !foundComment){ // error or comment not found
           console.log(err); // print the error
           req.flash('error', 'Sorry, this comment no longer exist!'); // message
           res.redirect('/blogs'); // redirects to blogs this has to change to main... or blogs...
       } else if(foundComment.author.id.equals(req.user._id)){ // if user is the author
            req.comment = foundComment;
            next(); // go on... to the next function
       }
    });
  }
}
