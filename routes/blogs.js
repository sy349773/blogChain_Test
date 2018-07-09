/**
*Get all dependencies
*/
var express = require("express");
var router  = express.Router();
var Blog = require("../models/blogs");
var Comment = require("../models/comments");
var middleware = require("../middleware/index");
var filesMiddleware = require("../middleware/files");
var cloudinary = require("../models/cloudinary");
var { isUserLoggedIn, checkAuthorBlog, checkAuthorComment} = middleware;

/**
* Get Route to list all the blogs...
*/
router.get("/", function(req, res){
  Blog.find({}, function(err, allBlogs){
    if(err){
      console.log(err);
    } else {
        if(req.xhr) {
            res.json(allBlogs);
        } else {
            res.render("main/blogs",{blogs: allBlogs});
        }
    }
  });
});

//get Route to the form to create new Blogs... only if logged in...
router.get("/new", isUserLoggedIn, function(req, res){
   res.render("main/new");
});

/**
*Get route for a single Blog
*/
router.get("/:id", function(req, res){
    //console.log("hola");
    //find the Blog with the req  ID
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){

        if(err || !foundBlog){
            console.log(err);
            req.flash('error', 'Sorry, that campground does not exist!');
            return res.redirect('/blogs');
        }
        //console.log(foundBlog);
        res.render("main/blog", {blog: foundBlog}); // render blog
    });
});
/**
* Post  Route to create a new blog...
*/
router.post("/", isUserLoggedIn, filesMiddleware.single('image'),function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  };
  /**
  *This is the default image if it does not exist.
  */
  var url = "https://oroinc.com/b2b-ecommerce/wp-content/uploads/sites/3/2018/04/cryptocurrency-b2b-ecommerce.png";
  var id_image = "none";
  //Create object blog...
  var newBlog = {name: name, content: desc, imageID: id_image, imageURL: url ,author:author};
  // Create a new Blog and save to DB
  Blog.create(newBlog, function(err, blogCreated){
        if(err){ // if there an error we go back to blogs...
          req.flash('error', err.message); // flash message
          return res.redirect('blogs/');
        } else {
          if(req.file){ // make sure the user selected a file... otherwise the server will crash...
            //console.log("file found...");
            cloudinary.v2.uploader.upload(req.file.path, function(err, result){
              if(!err){
                //update variables if succesful...
                url = result.url;
                id_image = result.public_id;
                //console.log("uploaded image...");
                //console.log(url+ "   " + id_image);
                req.flash('success', 'Blog Created!'); // all good.. redirect to blogs...
                res.redirect("/blogs");
              }
              else{
                //console.log(err.message);
                req.flash('error', "Your selected image could not be uploaded... "+err.message); // update error and try to update blog
                res.redirect("/blogs");
              }
            });
          }else{ // no file...
            req.flash('success', 'Blog Created!');
            res.redirect("/blogs");
          }
        }
    });
  });


//Delte route to delete blog...
router.delete("/:id", isUserLoggedIn, checkAuthorBlog, function(req, res){
  Comment.remove({
    _id: {$in: req.blog.comments} // delete all comments from blog first
  }, function(err){
    if(err){ // if error display msg
      req.flash('error', err.message);
      res.redirect('/');
    }
    else{ // then we remove the blog...
      req.blog.remove(function(err) {
        if(err) { // error message
          req.flash('error', err.message);
          return res.redirect('/');
        }
        req.flash('success', 'Blog deleted!');
        res.redirect('/blogs');
      });
    }
  })
});

//export the router

module.exports = router;
