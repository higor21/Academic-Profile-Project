var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campground"),
    methodOverride  = require("method-override"),
    upload      = require("../config/config"),
    cloudinary  = require('cloudinary'),
    middleware  = require("../middleware/index")
    
    
router.use(methodOverride("_method"))
// =============================================================================
// Routes for Campgrounds

router.get("/", function(req, res){
    Campground.find({}, function(err, all_camps){
        if(err){
            res.send("Error to find campgrounds!")
        }else{
            res.render("campgrounds/campgrounds", {camps: all_camps, page: 'campgrounds'})
        }
    })
})

router.put("/:id", middleware.checkCampgroundOwnership, upload.single('image'), function(req, res){
    cloudinary.uploader.upload(req.file.path, function(result) {
        req.body.camp.image = result.secure_url
        Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, camp){
            if(err){
                console.log(err)
            }else
                res.redirect("/campgrounds/" + req.params.id)
        })
    });
})

router.put("/:id_camp/putStar", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id_camp, function(err, camp) {
        if(!err && req.body.star){
            var index = camp.stars.map(obj => {return obj.userId}).indexOf(req.query.user)
            if(index == -1){
                camp.stars.push({userId: req.query.user, score: req.body.star})
            }else{
                camp.stars[index].score = req.body.star
            }
            camp.score = camp.stars.map(obj => {return obj.score}).reduce((a,b) => {return parseInt(a)+parseInt(b)})/camp.stars.length
            camp.save(function(err, camp_s){
                if(err){
                    console.log(err)
                }
                req.flash("success", "Thank you for your rating!")
                return res.redirect('back')
            })
        }else{
            req.flash("error", "Give your opinion before!")
            res.redirect('back')
        }
    })
}) 

router.put("/:id/features_list", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, camp) {
        if(!err){
            camp.features_list = JSON.parse(unescape(req.body.features_list))
            camp.save(function(err, camp_s){
                if(err){
                    return res.redirect('back')
                }
                res.redirect("/campgrounds/" + req.params.id)
            })
        }
    })
})

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, req.body.camp, function(err, camp){
        if(!err){
            res.redirect("/campgrounds")
        }
    })
})

router.post("/", middleware.isLoggedIn, upload.single('image') , function(req, res){
    cloudinary.uploader.upload(req.file.path, function(result) {
        //console.log(result)
        
        Campground.create({
            name: req.body.name,
            image: result.secure_url,
            description: req.body.description,
            author: {
                id: req.user._id,
                username: req.user.username
            }
        }, function(err, camp){
            if(err)
                res.send("Something went wrong");
            else{
                res.redirect("/campgrounds")
            }
        })
    });
})

router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new")
})

router.get("/:id", function(req, res) {
    // The 'populate("attribute").exec(function(vars ...){...})' serves to become "attribute" ids into their value
    Campground.findById(req.params.id).populate("comments").exec(function(err, obj){
        if(err)
            res.send("Something went wrong!")
        else{
            obj.features_list = escape(JSON.stringify(obj.features_list))
            res.render("campgrounds/show", {camp: obj})
        }
    })
})

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, camp){
        if(!err){
            res.render("campgrounds/edit", {camp: camp})
        }
    })
})


// =============================================================================

module.exports = router