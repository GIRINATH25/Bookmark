const express = require('express');
const mongoose = require('mongoose');
const bookmark = require("./routes/bookmark");
const handleuser = require("./routes/handleuser");
const cors = require('cors');
const cookie = require("cookie-parser");
require("dotenv").config();

const app = express();
const env=process.env;
app.use(express.json());
app.use(cookie(path='/'));
app.use(cors({
    origin:[env.Front_END],
    credentials:true,
}));


app.use("/",bookmark);
app.use("/",handleuser);

app.listen(env.PORT,()=>{
    console.log("listening on 8000 ");
})

mongoose.connect(env.MONGODB_URL)
        .then(()=>{
            console.log("connected to MongoDB");
        })
        .catch((e)=>{
            console.log("Error connecting to MongoDB");
        })