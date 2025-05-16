const mongoose  = require('mongoose');

const cartItem = new mongoose.Schema({
    bookId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Books',
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
        min:1,
        default:1,
    },
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Orders',
        required:true,
        default:null,
    },
    price:{
        type:Number,
        required:true,
    },
}, {timestamps:true});

module.exports = mongoose.model('CartItem', cartItem);