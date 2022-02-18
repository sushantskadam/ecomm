const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
  products : [{
    id:{type:String},
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
    mobile: { type: String },
    product_dimension: { type: String },
    product_material: { type: String },
    createdAt: { type: Date, default: Date.now },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    color_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "color",
    },
    product_subImages: {
      type: [String],
    },quantity:{type:Number},
  }],


email:{type:String},

  created_at: { type: Date, default: Date.now },
});
module.exports = mongoose.model("cart", cartSchema);


