var Comment = require("../models/comment")
var Campground = require("../models/campground")

var middlewareObj = {}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated())
        return next()
    req.flash("error", "You must be logged in to do that!")
    res.redirect("/login")
}

middlewareObj.checkPermissionToEdit = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.idComment, function(err, foundComment) {
            if(!err && foundComment.author.id.equals(req.user._id))
                next()
            else{
                req.flash("error", "You don't have permission to do that!")
                res.redirect('back')
            }
        })
    }else{
        req.flash("error", "You aren't authenticated!")
        res.redirect('/login')
    }
}

middlewareObj.checkPermissionToRemove = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.idComment, function(err, foundComment) {
            if(!err)
                Campground.findById(req.params.id, function(err, foundCamp) {
                    if(!err && (req.user.isAdmin || foundComment.author.id.equals(req.user._id) || foundCamp.author.id.equals(req.user._id)))
                        next()
                    else{
                        req.flash("error", "You don't have permission to do that!")
                        res.redirect('back')
                    }
                })
        })
    }else{
        req.flash("error", "You aren't authenticated!")
        res.redirect('/login')
    }
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, camp) {
            if(!err && (camp.author.id.equals(req.user._id) || req.user.isAdmin))
                next()
            else{
                req.flash("error", "You don't have permission to do that!")
                res.redirect('back')
            }
        })
    }else{
        req.flash("error", "You aren't authenticated!")
        res.redirect('back')
    }
}

module.exports = middlewareObj