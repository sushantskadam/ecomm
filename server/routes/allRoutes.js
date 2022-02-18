const express = require("express");
const fs = require("fs");
const router = express.Router();
const bcrypt = require("bcrypt");
const sendmail = require("../helpers/sendmail");
const multer = require("multer");
// let uuidv4 = require("uuidv4");
// router.use(express.static("uploads"));
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(express.static("uploads"));

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
const path = require("path");
const connectDB = require("../config/db");
//JWT
const jwt = require("jsonwebtoken");
const jwtSecret = "asdsahdhasdvh242143hjbhasdf3wq";
const userModel = require("../models/userSchema");
const productModel = require("../models/productSchema");
const catModel = require("../models/categorySchema");
const colorModel = require("../models/colorSchema");
const {
  getProddata,
  getCategory,
  getColor,
  getProduct,
} = require("../controllers/ProductController");
const productSchema = require("../models/productSchema");
const {
  signup,
  sendmailotp,
  updatePassword,
  changePassword,
  login,
  getUser,
  updateUser,
  updateImg,
  addAddr,
  getCustAddress,
  deleteAddr,
  updAddr,
  socLogin,
} = require("../controllers/UserController");
const {
  addCartd,
  getCart,
  delCart,
  updateCart,
} = require("../controllers/CartController");

const {
  addProd,
  delProd,
  updateProd,
} = require("../controllers/AdminController");

const { checkout, getOrders } = require("../controllers/CheckoutController");
const { upload } = require("../helpers/FileUpload");

const Razorpay = require("razorpay");
const crypto = require("crypto");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    res.json({ err: 1, msg: "Token not matched" });
  } else {
    console.log(token);
    jwt.verify(token, jwtSecret, (err, data) => {
      if (err) {
        // res.json({ err: 2, msg: "Token incorrect",error:err });
        res.json({ err: 2, msg: "Token Expired",error:err });

      } else {
        next();
      }
    });
  }
}

connectDB();

// router.get("/users", (req, res) => {
//   userModel.find({}, (err, data) => {
//     if (err) throw err;
//     else {
//       res.json({ err: 0, data: data });
//     }
//   });
// });
router.get("/getproducts", getProddata);

router.get("/getproduct/:id", getProduct);

router.get("/profile/:email", getUser);
router.get("/getCustAddress/:email", authenticateToken, getCustAddress);

router.put("/deleteAdd/:email", authenticateToken, deleteAddr);
router.put("/updateAddr/:email", authenticateToken, updAddr);
router.get("/getcategory", getCategory);
router.get("/getcolors", getColor);

router.post("/login", login);
router.post("/signup", signup);
router.post("/soclogin", socLogin);

router.post("/sendmailotp", sendmailotp);

router.put("/profile", authenticateToken, updateUser);
router.put("/updateimg", authenticateToken, upload.single("myfile"), updateImg);

router.put("/addaddress/:email", authenticateToken, addAddr);

router.delete("/deleteuser/:id", (req, res) => {
  const id = req.params.id;
  userModel.deleteOne({ _id: id }, (err) => {
    if (err) throw err;
    else {
      res.send("Category Deleted");
    }
  });
  // data.splice(index + 1, 1);
  console.log(index);
});
router.put("/updatepassword", updatePassword);
router.put("/changepassword", authenticateToken, changePassword);

router.post("/addcart", addCartd);
router.get("/getcart/:email", getCart);
router.delete("/delcartitem/:id", authenticateToken, delCart);
router.put("/updcart/:id", authenticateToken, updateCart);

router.post("/addProductToCartCheckout", authenticateToken, checkout);
router.get("/getOrderDetails/:email", authenticateToken, getOrders);

router.post("/addprod", authenticateToken, upload.single("myfile"), addProd);
router.delete("/delprod/:id", authenticateToken, delProd);
router.put(
  "/updateprod/:id",
  authenticateToken,
  upload.single("myfile"),
  updateProd
);

router.post("/orders", async (req, res) => {
  // console.log(process.env.RAZORPAY_KEY_ID,process.env.RAZORPAY_SECRET)
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    let total = req.body.total;

    const options = {
      amount: total, // amount in smallest currency unit
      currency: "INR",
      receipt: "receipt_order_74394",
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
});

router.post("/success", async (req, res) => {
  console.log(req.body);
  try {
    // getting the details back from our font-end
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    // Creating our own digest
    // The format should be like this:
    // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    const digest = shasum.digest("hex");

    // comaparing our digest with the actual signature
    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: "Transaction not legit!" });

    // THE PAYMENT IS LEGIT & VERIFIED
    // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

    res.json({
      msg: "Payment Done",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/tokenAuth",authenticateToken,async (req, res) => {
  res.status(200).json({ err: 0, msg: "Token Authenticated" });
 
});

router.get("/getAllOrders", authenticateToken, getAllOrders);

module.exports = router;
