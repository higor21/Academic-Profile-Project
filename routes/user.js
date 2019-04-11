var express     = require("express"),
    router      = express.Router(),
    User        = require("../models/user"),
    Campground = require("../models/campground"),
    passport    = require("passport"),
    methodOverride = require("method-override"),
    upload      = require("../config/config"),
    middleware  = require("../middleware/index"),
    cloudinary  = require("cloudinary")
    
// =============================================================================
// User Routes

router.use(methodOverride('_method'))

router.get("/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err)
            res.send("User was not found or don't exist anymore")
        else{
            
            Campground.find({author: {id: foundUser._id, username: foundUser.username}}, function(err, foundCamps){
                if(!err){
                    res.render("user/show", {user: foundUser, camps: foundCamps})
                }
            })
        }
    })
})

router.put("/:id", upload.single('image_url'), middleware.isLoggedIn, middleware.checkPermissionToEditUser , function(req, res){
    var current_user = req.body.user
    if(req.file){
        cloudinary.uploader.upload(req.file.path, function(result) {
            current_user.image_url = result.secure_url;
            update_user(current_user, req, res)
        })
    }else
        update_user(current_user, req, res)
    
})

router.get("/:id/edit", middleware.isLoggedIn, middleware.checkPermissionToEditUser,function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err)
            res.send("User was not found or don't exist anymore")
        else{
            res.render("user/edit", {user: foundUser})
        }
    })
})

var update_user = function(user, req, res){
    var skills = user.skills
    skills = skills.substr(0, skills.length - 1).split(',')
    user.skills = (skills[0] == "" && skills.length == 1) ? [] : skills
    
    User.findByIdAndUpdate(req.params.id, user, function(err, updated_user){
        if(!err){
            res.redirect("/user/"+req.params.id)
        }
    })
}

// =============================================================================

module.exports = router