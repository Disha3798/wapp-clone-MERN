import mongoose from "mongoose";

const wappSchema=mongoose.Schema({
    name:String,
    messages:[
        {
            message:String,
            name:String,
            timestamp:String,
            send:Boolean,
        }
    ]
    
});

export default mongoose.model('roomcontents',wappSchema);