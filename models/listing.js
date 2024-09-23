const mongoose= require("mongoose");
// we store mongoose.schema in "schema "varible so we dont have to write everytime we just write "schema".
const Schema=mongoose.Schema;


const listSchema = new Schema(
    {
    title :{ 
        type:String,
        require:true
          },
    description :String,
    image : {
        type:String,
        default:"https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        set:(v)=> v=== "" ? "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" :v,
        // here we use ternery operator , we compare v value to empty string ;
    },
    price : Number,
    location : String,
    country : String,
    owner: {
        type : Schema.Types.ObjectId,
        ref : "User"
    }

  
 });


const listing = mongoose.model("listing",listSchema);
module.exports= listing;
