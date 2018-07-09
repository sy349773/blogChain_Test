const express = require("express");
const router  = express.Router({mergeParams: true});
const Blog = require("../models/blogs");
const Comments = require("../models/comments");
const middleware = require("../middleware/index");
const { isUserLoggedIn, checkAuthorBlog, checkAuthorComment } = middleware;

/**
*Post route to add a new comment...
*/
router.post("/new", isUserLoggedIn, function(req, res){
    // find campground by id
    console.log(req.params.id);
    Blog.findById(req.params.id, function(err, blog){
        if(err){
          req.flash('error', 'Sorry, that blog does not exist!');
          return res.redirect('main/blogs');
        } else {
             //res.render("comments/new", {campground: campground}); add comments
             Comments.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    blog.comments.push(comment);
                    blog.save();
                    console.log(comment);
                    req.flash('success', 'Created a comment!');
                    res.redirect('/blogs/' + blog._id);
                }
              });
        }
    });
});

/**
*Delete Route to delete a comment
*/
router.delete("/:commentId", isUserLoggedIn, checkAuthorComment, function(req, res){
  // find campground, remove comment from comments array, delete comment in db
  Blog.findByIdAndUpdate(req.params.id, {
    $pull: {
      comments: req.comment.id
    }
  }, function(err) {
    if(err){
        console.log(err)
        req.flash('error', err.message);
        res.redirect('/');
    } else {
        req.comment.remove(function(err) {
          if(err) {
            req.flash('error', err.message);
            return res.redirect('/');
          }
          console.log("deleting...");
          req.flash('error', 'Comment deleted!');
          res.redirect("/blogs/" + req.params.id);
        });
    }
  });
});

module.exports = router;
