
if(process.env.NODE_ENV != "production"){
    require('dotenv').config(); 
}


// requiring packages.
const express= require("express");
const app =express();
const mongoose= require("mongoose");
const path = require("path");
const ejsMate= require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');


const listings = require("./routes/listing.js");
// requiering routes for listings 
// this route is for signup User (user.js)
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;


main()
.then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    // connecting to database
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto: {
    secret:process.env.SECRET,
  },
  touchAfter:24*3600
});

store.on("error" , () => {
    console.log("ERROR IN MONGO SESSION STORE" , err);
});
const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave : false,
    saveUninitialized: true,
    cookie :{
        // expiry of cookie
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        // Date.now() returns exact current time , we have to pass miliseconds to expire the cookie
        // we want cookie expire in (1 week) 7 =days , 24H in 1 day , 60 min in 1 Hour ,60 sec in 1 min , 1000 milisec in 1 second.
        maxAge :  7 * 24 * 60 * 60 * 1000, //giving age (1 Week) of cookie
        httpOnly: true
    }
};



app.use(session(sessionOptions));
// flash always use after the sessions
app.use(flash());


passport.initialize();
passport.session();
passport.use(new LocalStrategy (User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use( (req , res ,next ) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser =req.user;
    
    next();
    // this is an middleware for flash 
});



// setting route for server.
// app.get("/",(req,res)=>{
//     res.send("hello from root");
   
// })

// we are using express Router() for listings and user sign up
app.use("/listings" , listings);
app.use("/" , userRouter);


app.get("*", (req,res,next)=>{
  next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next )=>{
  let {statusCode=500, message="Something went wrong !"} = err;
  res.status(statusCode).render("error.ejs",{message});

});


// starting server.
app.listen(8080,()=>{
    console.log("server is working !");
});



