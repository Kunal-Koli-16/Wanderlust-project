const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { SaveRedirectUrl } = require("../middleware.js");
const userControllers = require("../controllers/user.js");


router.use(passport.initialize());
router.use(passport.session());

// we combine same path used by get req and post req using router.route
router.route("/signup" )
.get(userControllers.renderSignUpForm)
.post(wrapAsync(userControllers.signUp));
       
router.route("/login")
// login route
.get(userControllers.renderLoginForm)
// adding middleware - passport.authenticate() use for authentication
// passing strategy as local because we have local strategy 
// and if authentication failure occurs then redirect to login page. 
.post(SaveRedirectUrl,
passport.authenticate('local', 
{ failureRedirect: '/login', failureFlash : true}) ,
userControllers.login);

router.get("/logout" , userControllers.logout);

module.exports = router;