const productModel = require("../models/productSchema");
const { multi_upload } = require("../helpers/FileUpload");
//for img upload
const multer = require("multer");
const orderModel=require('../models/orderSchema')

function addProd(req, res) {
  console.log(req.file.filename)
  console.log(req.body);
    let data = {
      product_name: req.body.product_name,
      product_desc: req.body.product_desc,
      product_cost: req.body.product_cost,
      product_producer: req.body.product_producer,
      product_dimension: req.body.product_dimension,
      product_material: req.body.product_material,
      product_subImages: req.file.filename,
    };
    let ins = new productModel(data);
    ins.save(async(err) => {
      console.log(err);
      if (err) {
        res.json({ err: "already added", message: "already added" });
      } else {
        const proddata = await productModel.find({});
        res.json({
          err: 0,
          success: true,
          status_code: 200,
          msg: "Successfully Added",
          proddata:proddata
        });
      }
    });
  // console.log(email)
  // multi_upload(req, res, function (err) {
  //   console.log(req.files);
  //   if (err instanceof multer.MulterError) {
  //     res
  //       .status(500)
  //       .send({ error: { message: `Multer uploading error1: ${err.message}` } })
  //       .end();
  //     return;
  //   } else if (err) {
  //     if (err.name == "ExtensionError") {
  //       res.json({ err: err.name });
  //     } else {
  //       res
  //         .status(500)
  //         .send({
  //           error: { message: `unknown uploading error: ${err.message}` },
  //         })
  //         .end();
  //     }
  //     return;
  //   }
  //   console.log(req.body);
  //   console.log(req.files);
  //   let data = {
  //     product_name: req.body.product_name,
  //     product_desc: req.body.product_desc,
  //     product_cost: req.body.product_cost,
  //     product_producer: req.body.product_producer,
  //     product_dimension: req.body.product_dimension,
  //     product_material: req.body.product_material,
  //     product_subImages: req.files[0].filename,
  //   };
  //   let ins = new productModel(data);
  //   ins.save(async(err) => {
  //     console.log(err);
  //     if (err) {
  //       res.json({ err: "already added", message: "already added" });
  //     } else {
  //       const proddata = await productModel.find({});
  //       res.json({
  //         err: 0,
  //         success: true,
  //         status_code: 200,
  //         msg: "Successfully Added",
  //         proddata:proddata
  //       });
  //     }
  //   });
  // });
}
const delProd = (req, res) => {
  const id = req.params.id;
  console.log(id);
  productModel.deleteOne({ _id: id }, async (err) => {
    if (err) throw err;
    else {
      const proddata = await productModel.find({});
      res.json({
        err: 0,
        success: true,
        status_code: 200,
        msg: "Item Deleted",
        proddata: proddata,
      });
    }
  });
};

const updateProd = (req, res) => {
  productModel.updateOne(
    // { email: req.body.pemail },

    { _id: req.params.id },
    {
      $set: {
        product_name: req.body.product_name,
        product_desc: req.body.product_desc,
        product_cost: req.body.product_cost,
        product_producer: req.body.product_producer,
        product_dimension: req.body.product_dimension,
        product_material: req.body.product_material,
        product_subImages: req.file.filename,
      },
    },
    async (err) => {
      if (err) throw err;
      else {
        const proddata = await productModel.find({});

        res.json({
          msg: "Edit Done",
          err: 0,
          status_code: 200,
          proddata: proddata,
        });
        console.log("done");
      }
    }
  );

  // multi_upload(req, res, function (err) {
  //   console.log(req.files);
  //   if (err instanceof multer.MulterError) {
  //     res
  //       .status(500)
  //       .send({ error: { message: `Multer uploading error1: ${err.message}` } })
  //       .end();
  //     return;
  //   } else if (err) {
  //     if (err.name == "ExtensionError") {
  //       res.json({ err: err.name });
  //     } else {
  //       res
  //         .status(500)
  //         .send({
  //           error: { message: `unknown uploading error: ${err.message}` },
  //         })
  //         .end();
  //     }
  //     return;
  //   }

  //   productModel.updateOne(
  //     // { email: req.body.pemail },

  //     { _id: req.params.id },
  //     {
  //       $set: {
  //         product_name: req.body.product_name,
  //         product_desc: req.body.product_desc,
  //         product_cost: req.body.product_cost,
  //         product_producer: req.body.product_producer,
  //         product_dimension: req.body.product_dimension,
  //         product_material: req.body.product_material,
  //         product_subImages: req.files[0].filename,
  //       },
  //     },
  //     async (err) => {
  //       if (err) throw err;
  //       else {
  //         const proddata = await productModel.find({});

  //         res.json({
  //           msg: "Edit Done",
  //           err: 0,
  //           status_code: 200,
  //           proddata: proddata,
  //         });
  //         console.log("done");
  //       }
  //     }
  //   );
  // });
};
getAllOrders=(req,res)=>{
  const email = req.params.email;    
    
  orderModel.find({}, (err, data) => {
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

module.exports = { addProd, delProd, updateProd,getAllOrders};
