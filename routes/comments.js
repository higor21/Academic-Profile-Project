var express     = require("express"),
    // The code '{mergeParams: true}' allows the node framework to know the 'params', for example the ':id'
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware/index")

// =============================================================================
// Routes for Comments

router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, camp){
        if(!err){
            res.render("comments/new", {camp: camp})    
        }
    })
})

router.put("/:idComment", middleware.checkPermissionToEditComment, function(req, res){
    Comment.findByIdAndUpdate(req.params.idComment, req.body.comment, function(err, comment){
        if(!err)
            res.redirect("/campgrounds/" + req.params.id)
    })
})

router.delete("/:idComment", middleware.checkPermissionToRemoveComment, function(req, res){
    Comment.findByIdAndRemove(req.params.idComment, function(err, comment){
        if(!err)
            res.redirect("/campgrounds/" + req.params.id)
    })
})

router.get("/:idComment/edit", middleware.checkPermissionToEditComment, function(req, res){
    Comment.findById(req.params.idComment, function(err, comment){
        if(err)
            res.redirect("back")
        else{
            Campground.findById(req.params.id, function(err, foundCamp) {
                if(!err)
                    res.render("comments/edit", {comment: comment, camp: foundCamp})
            })
        }
    })
})

router.post("/", middleware.isLoggedIn , function(req, res){
    Campground.findById(req.params.id, function(err, camp){
        if(!err){
            Comment.create(req.body.comment, function(err, comment){
                if(!err){
                    comment.author = {
                        id: req.user._id,
                        username: req.user.username
                    }
                    comment.save()
                    camp.comments.push(comment)
                    camp.save(function(err, new_camp){
                        if(!err){}
                            //console.log("new comment: " + comment)
                    })
                    req.flash("success", "Successfully added comment!")
                    res.redirect("/campgrounds/" + req.params.id)
                }
            })
        }
    })
})

// =============================================================================

module.exports = router