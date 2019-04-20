var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose")

var UserSchema = new mongoose.Schema({
    image_url: String, // It has to change (image from upload)
    username: String,
    firstname: String,
    lastname: String,
    description: String,
    occupation: String,
    phone_number: String,
    home_page_link: String,
    linkedin_link: String,
    lattes_link: String,
    github_link: String,
    password: String,
    bg_option: String,
    email: String,
    isAdmin: {type: Boolean, default: false},
    skills: []
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema)