const cartModel = require("../models/cartSchema");
function getCart(req, res) {
  const email = req.params.email;
  // console.log(email)
  cartModel.findOne({ email: email }, (err, data) => {
    if (err) throw err;
    else {
      res.json({ err: 0, success: true, status_code: 200, data: data });
    }
  });
}

const addCartd = async (req, res) => {
  const { email, cart } = req.body;
  //insert data
  // console.log(req.body)
  let oldUser = await cartModel.findOne({ email: req.body.email });
  if (oldUser) {
    console.log("true")

    cartModel.updateOne(
      { email: req.body.email },
      { $set: { products: cart } },
      (err) => {
        if (err) throw err;
        else {
          res.json({
            msg: "products Updated",
            err: 0,
            success: true,
            status_code: 200,
          });
          console.log("updated");
        }
      }
    );
  } else {
    let ins = new cartModel({ products: cart, email: email });
    ins.save((err) => {
      if (err) {
        res.json({ err: "already added", message: "already added" });
      } else {
        res.json({
          err: 0,
          success: true,
          status_code: 200,
          msg: "Item Successfully Added",
        });
      }
    });
    console.log("inserted");

  }
};
const delCart = (req, res) => {
  const email = req.params.email;
  cartModel.deleteOne({ email: email }, (err) => {
    if (err) throw err;
    else {
      res.json({
        err: 0,
        success: true,
        status_code: 200,
        msg: "Item Deleted",
      });
    }
  });
};
const updateCart = (req, res) => {
  cartModel.updateOne(
    { _id: req.params.id },
    { $set: { quantity: req.body.quantity } },
    (err) => {
      if (err) throw err;
      else {
        res.json({ msg: "Quantity Updated", err: 0, status_code: 200 });
        // console.log("done");
      }
    }
  );
};

module.exports = { getCart, addCartd, delCart, updateCart };
