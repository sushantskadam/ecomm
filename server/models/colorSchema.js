const mongoose = require("mongoose");
const colorSchema = new mongoose.Schema({
  color_name: {
    type: String,
  },
  color_code:{
      type:String
  },
  
  created_at: { type: Date, default: Date.now },
});
module.exports = mongoose.model("color", colorSchema);
