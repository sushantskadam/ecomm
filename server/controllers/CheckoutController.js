const orderModel=require('../models/orderSchema')
const createInvoice = require("../helpers/invoiceGenerator");
const sendInvoice = require('../helpers/sendInvoice');
const cartModel=require('../models/cartSchema')


const checkout = async (req, res) => {
    const {user,cartitems,total,address,paymentdetails}=req.body
    cartModel.remove({email:user.email})
    const filename = `new${Math.random()}`;

    createInvoice(req.body, `${__dirname}/../uploads/` + filename + ".pdf");
    sendInvoice(`${__dirname}/../uploads/` + filename + ".pdf", user.email);

    console.log(cartitems)
    let ins = new orderModel({email:user.email,cartitems:cartitems,paymentdetails,invoicename:filename + ".pdf",total:total,address:address});
    ins.save((err) => {
      if (err) {
        res.json({ err: "already added", message: "already added" });
      } else {
        res.json({
          err: 0,
          success: true,
          status_code: 200,
          msg: "Order Successfully Placed",
        });
      }
    });
    cartModel.deleteMany({ email: user.email }, (err) => {
     console.log("cart empty")
    });

    
  };
  getOrders=(req,res)=>{
    const email = req.params.email;    
      
    orderModel.find({email:email}, (err, data) => {
      if (err) throw err;
      else {
        res.json({
          err: 0,
          success: true,
          status_code: 200,
          data: data
        });
      }
    });
  }
  module.exports = {checkout,getOrders}