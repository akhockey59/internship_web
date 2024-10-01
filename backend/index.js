const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const users = require('./route/routes');
require('dotenv').config();
mongoose.connect("mongodb+srv://akhockey59:sky@postman.fwyhk.mongodb.net/",{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> console.log("connected successfully to the database"))
.catch((err)=> console.log("an error occured while connecting to the database", err));
app.use(express.json());
app.use(cors());
app.use('/api/users', users);
app.get('/', (req, res)=>{
    res.send("Welcome to POSTMAN API challenge");
});

const port = process.env.PORT || 5001;
app.listen(port,(req, res)=>{
    console.log(`Server running on port no. ${port}`);
});