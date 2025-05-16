const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
const allowedOrigins = ['https://book-app-gilt.vercel.app'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

 //Connet to the database 
const db = require('./config/dataBase');
db();

require('dotenv').config();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App is running on ${PORT} port number`);
});

const routes = require('./routes/authRoutes');
app.use("/book", routes);


app.get("/", (req, res) => {
    res.send("Server is working fine");
})
