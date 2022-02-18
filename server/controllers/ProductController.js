const productModel = require("../models/productSchema");
const catModel= require('../models/categorySchema')
const colorModel= require('../models/colorSchema')

 function getProddata(req,res) {
  productModel
    .find()
    .then((product) => {
      // res.send("Data Fetched");
      res.json({ err: 0, data: product });
      // return product
    });
}
function getProduct(req,res) {
  const id = req.params.id;

  productModel
    .findOne({_id:id})
    .then((product) => {
      // res.send("Data Fetched");
      res.json({ err: 0, data: product });
      // return product
    });
}


function getCategory(req,res) {
  catModel.find({}, (err, data) => {
    if (err) throw err;
    else {
      res.json({ err: 0, data: data });
    }
  });
}

function getColor(req,res) {
  colorModel.find({}, (err, data) => {
    if (err) throw err;
    else {
      res.json({ err: 0, data: data });
    }
  });
}
module.exports = { getProddata,getCategory,getColor,getProduct };



