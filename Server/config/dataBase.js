const mongoose = require('mongoose');

require('dotenv').config();

const dbConnect = async () => {
   await mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log("Database connected successfully")
    }).catch((err) => {
        console.log("Database connection failed", err.message);
        process.exit(1);
    })
}

module.exports = dbConnect;