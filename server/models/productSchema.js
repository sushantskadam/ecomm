const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
  },
  product_desc: {
    type: String,
  },
  product_rating: { type: Number },
  product_producer: { type: String },
  product_stock: { type: Number },
  product_cost: { type: Number },
  product_dimension: { type: String },
  product_material: { type: String },
  createdAt: { type: Date, default: Date.now },
  category:{type:String},
  color:{type:String},
  // category_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "category",
  // },
  // color_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "color",
  // },
  product_subImages: {
    type: [String],
  },
});
module.exports = mongoose.model("product", productSchema);
