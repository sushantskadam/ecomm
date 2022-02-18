const { application } = require('express');
const cors=require('cors')
const express = require('express');
const PORT=9999;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}))
require("dotenv").config();

app.use(express.static("uploads"));  //for img
app.use(cors())
//load routes
const allRoutes= require('./routes/allRoutes');
app.use("/",allRoutes)
app.listen(PORT,(err)=>{
    if(err) throw err;
    console.log("work on 9999")
}) 
