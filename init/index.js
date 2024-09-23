const mongoose= require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");
const mongo_url="mongodb://127.0.0.1:27017/Wanderlust";


main()
.then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    // connecting to database
    await mongoose.connect(mongo_url);
}

const initDB = async()=>{
    await listing.deleteMany({});
    await listing.insertMany(initData.data);
    console.log("data was initilised");
}

initDB();
