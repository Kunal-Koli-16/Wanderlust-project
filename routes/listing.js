const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const passport =require("passport");
const {isLoggedIn} = require("../middleware.js");
const listing = require("../models/listing.js");


const listingControllers = require("../controllers/listing.js");

router.use(passport.initialize());
router.use(passport.session());


const validateListing = (req,res,next) =>{
    let {error}= listingSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el)=> el.message).join(",");
     throw new ExpressError(404,errMsg);
    }
    else{
      next()
    }
  } 


router.route("/")
// index route
  .get(wrapAsync(listingControllers.index) )
    //  create route
  .post(isLoggedIn, validateListing,
    wrapAsync(listingControllers.createListing));
// .post( upload.single('listing[image]'),(req , res) =>{
//   res.send(req.file);
// });

//   new route
router.get("/new",isLoggedIn, listingControllers.renderNewForm);

// here we create combine route of "/:id" for get,put and delete req
  router.route("/:id")
   // show route for individual 
  .get( wrapAsync(listingControllers.showListing))
   //Update Route
  .put(isLoggedIn,validateListing,
    wrapAsync(listingControllers.updateListing))  
  //Delete Route
  .delete(isLoggedIn , wrapAsync(listingControllers.destroyListing));
 

//Edit Route
router.get("/:id/edit",isLoggedIn, wrapAsync(listingControllers.renderEditForm ));
      
 

  module.exports =router;