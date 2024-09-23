const mongoose= require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema ({
    email:{
        type :String,
        required: true
    },
});

userSchema.plugin(passportLocalMongoose);
// use for automatically implementing username , hashing , salting and hashpassword


module.exports = mongoose.model('User', userSchema);