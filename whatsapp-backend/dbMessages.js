import mongoose from "mongoose";

const wappSchema=mongoose.Schema({
    message:String,
    name:String,
    timestamp:String,
    send:Boolean,
})

export default mongoose.model('messagecontents',wappSchema);