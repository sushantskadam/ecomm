const mongoose = require("mongoose");
const catSchema = new mongoose.Schema({
  category_name: {
    type: String,
  },
  category_image: { type: String, required: true,unique: true },
  
  created_at: { type: Date, default: Date.now },
});
module.exports = mongoose.model("category", catSchema);
