const mongoose = require('mongoose');

const user = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        maxLength: 50,
    },
    lastName:{
        type:String,
        required:true,
        maxLength:50,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        maxLength:100,
    },
    password:{
        type:String,
        required:true,
        minLength:5,
        maxLength:100
    },
    role:{
        type:String,
        enum:['Admin', 'Customer'],
         default:'Customer'
    },
},{timestamps:true});

module.exports = mongoose.model('Users', user);