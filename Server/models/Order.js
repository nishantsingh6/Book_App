const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


 const order = new mongoose.Schema({
    orderDescription:{
        type:String,
        maxLength:500,
    },
    amount:{
        type:Number,
        required:true,
        max:10000,
    },
    address:{
        type:String,
        required:true,
        maxLength:500,
    },
    orderStatus:{
        type:String,
        required:true,
        enum:['Pending', 'Shipped', 'Placed', 'Cancelled'],
        default:'Pending',
    },
    trackingId:{
        type:String,
        default: () => uuidv4(),
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
         required:true,
    },
    cartItem:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'CartItem',
        }
    ]
 }, {timestamps:true});

 module.exports = mongoose.model('Orders', order);