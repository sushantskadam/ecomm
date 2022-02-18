const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  fname: {
    type: String,
  },
  lname: {
    type: String,
  },
  email: { type: String, required: true,unique: true },
  gender: { type: String},
  password: { type: String },
  mobile: { type: String},
  dob:{type:String},
  pimg:{type:String},
  date: { type: Date, default: Date.now },
  otp:{type:Number},
  soclogin:{type:Boolean},
  role:{type:String ,default:"user"},
  addresses:[{address:{type:String},pincode:{type:Number},city:{type:String},state:{type:String},country:{type:String}}]
});
module.exports = mongoose.model("user", userSchema);
