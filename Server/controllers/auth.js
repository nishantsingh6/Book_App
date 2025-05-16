const User = require('../models/Users'); //Import the User model
const Order = require('../models/Order'); //Import the Order model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = async(req, res) => {
    try{
        const {firstName, lastName, email, password,role} = req.body;

        if(!firstName || !lastName || !email || !password ){
            return res.status(400).json({
                message:"Please provide all the details",
                error:"Please fill all the details"
            });
        }

        const existUser = await User.findOne({email});
        if(existUser){
          return res.status(400).json({
            message:"User already exists",
            error:"User already exists"
          });
        }
         
        let hashPassword ;
        try{
           hashPassword = await bcrypt.hash(password, 10);
        }catch(err){
            return res.status(500).json({
                message:"Unable to hash password",
                error: err.message
            });
        }

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password:hashPassword,
            role,
        });
       return res.status(201).json({
        message:'User created successfully',
        newUser
       })
    }catch(err){
        return res.status(500).json({
            message:"Unable to create user",
            error: err.message
        });
    }
};



exports.login = async(req, res) => {
    try{
     const {email, password} =req.body;
      
     if(!email || !password){
        return res.status(400).json({
            message:"Please provide email and password",
            error:"Please fill all the details"
        })
     }

     const existUser = await User.findOne({email});
     if(!existUser){
        return res.status(400).json({
            message:"User does not exist",
            error:"User does not exist"
        });
     }

     const isMatch = await bcrypt.compare(password, existUser.password);
        if(!isMatch){
            return res.status(400).json({
                message:"Passowrd is incorrect",
                error:"Password is incorrect"
            });
        }

     const payload = {
        email:existUser.email,
        password:existUser.password,
        role:existUser.role,
        id:existUser._id
     }
     
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1d', 
        });


        const options = {
            expires: new Date(Date.now() + 2*24*60*60*1000), // 2 days
            httpOnly:true, 
        }

          res.cookie("token", token, options).status(200).json({
            message:"User Logged in Successfully",
            token,
            user:{
                id:existUser._id,
                firstName:existUser.firstName,
                lastName:existUser.lastName,
                email:existUser.email,
                role:existUser.role
            }
        });

     }catch(error){
        return res.status(500).json({
            message:"Error occured while logging in",
            error:error.message
        });
    }
}