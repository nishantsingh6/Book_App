const mongoose = require('mongoose');

const book = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        maxLength: 100,
    },
    image:{
     type:String,
     required:true, 
    },
    author:{
        type:String,
        required:true,
        maxLength:100,
    },
    description:{
        type:String,
        required:true,
        maxLength:500,
    },
    price:{
        type:Number,
        required:true,
        min:1,
        max:10000,
    },
    genre:{
        type:String,
        required:true,
        enum:['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography','Fantasy'],
    },
    condition:{
        type:String,
        required:true,
        enum:['New', 'Used', 'Refurbished','Like New'],
    },
    edition:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:['Available', 'Sold'],
        default:'Available'
    }
});

module.exports = mongoose.model('Books', book);