const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required  :true
    },
    email : {
        type : String,
        required : true
    },
    role : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : new Date(Date.now()),
        required : true
    },
    updatedAt : {
        type : Date,
        default : new Date(Date.now()),
        required : true
    }
})

module.exports = mongoose.model("User",UserSchema);