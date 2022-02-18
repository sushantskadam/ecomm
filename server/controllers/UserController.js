const userModel = require("../models/userSchema");
const sendmail = require("../helpers/sendmail");
const bcrypt = require("bcrypt");
//JWT
const jwt = require("jsonwebtoken");
const jwtSecret = "asdsahdhasdvh242143hjbhasdf3wq";
const { multi_upload } = require("../helpers/FileUpload");
//for img upload
const multer = require("multer");

const login = async (req, res) => {
  const { email, password } = req.body;
  // let email = req.body.username;
  // let password = req.body.password;
  const user = await userModel.findOne({ email: email });
  
  if (user) {
    const validPassword = await bcrypt.compare(password, user.password);
    if(user.soclogin){
      res.json({ err: 3, msg: "already reg with social login" });

    }
    // check user password with hashed password stored in the database
    
    else if (validPassword) {
      // res.status(200).json({ message: "Valid password" });
      let payload = {
        uid: email,
      };
      const token = jwt.sign(payload, jwtSecret, { expiresIn: '10m' });
      res.json({
        err: 0,
        success: true,
        status_code: 200,
        msg: "You Have Logged In",
        token: token,
        user:user
      });
    } else {
      res.status(200).json({ err: 1, msg: "Invalid Password" });
      // res.status(400).json({ error: "Invalid Password" });
    }
  } else {
    res.json({ err: 2, msg: "User does not exist" });
    // res.status(401).json({ error: "User does not exist" });
  }
};

const signup = async (req, res) => {
  console.log(req.body.email);
  let email = req.body.email;
  let oldUser = await userModel.findOne({ email: req.body.email });
  
  console.log(oldUser)
      if(oldUser) {
        // return res.status(409).send("User Already Exist. Please Login");
        if(oldUser.soclogin){
          return res.json({ err: 3, message: "social login" });
      
        }else{
          return res.json({ err: 2, message: "User Already Exist. Please Login" });

        }
      }
      else{
        let encpassword = req.body.password;
        const hashpassword = bcrypt.hashSync(encpassword, 10);
      
        //insert data
      
        const data = {
          fname: req.body.fname,
          lname: req.body.lname,
          email: req.body.email,
          mobile: req.body.mobile,
          password: hashpassword,
          gender: req.body.gender,
        };
      
        let ins = new userModel(data);
        ins.save((err) => {
          console.log(err);
          if (err) {
            res.json({ err: "already added", message: "already added" });
          } else {
            res.json({
              err: 0,
              success: true,
              status_code: 200,
              msg: "Successfully Added",
            });
          }
        });
      }
  
};


const socLogin = async (req, res) => {
  console.log("soclogin",req.body);
  let email = req.body.email;
  let olduser = await userModel.findOne({ email: req.body.email });
  // console.log(olduser)
  let payload = {
    uid: email,
  };
  const token = jwt.sign(payload, jwtSecret, { expiresIn: 360000 });
      if(olduser) {

        // return res.status(409).send("User Already Exist. Please Login");
        return res.json({ err: 2, message: "User Exists." ,data:olduser,token:token});
      }else{


  // insert data

  const data = {
    fname: req.body.firstName,
    lname: req.body.lastName,
    email: req.body.email,
    mobile: "",
    password: "",
    gender: req.body.gender,
    soclogin:true,
    pimg:req.body.profilePicURL
  };

  let ins = new userModel(data);
  ins.save((err) => {
    console.log(err);
    if (err) {
      res.json({ err: "already added", message: "already added" });
    } else {
      res.json({
        err: 0,
        success: true,
        status_code: 200,
        msg: "Successfully Added",
        token:token
      });
    }
  });
};
      }


const updatePassword = (req, res) => {
  let { email, password } = req.body;

  // const filename = `new${Math.random()}`;

  const hashpassword = bcrypt.hashSync(password, 10);
  userModel.updateOne(
    { email: email },
    {
      $set: {
        password: hashpassword,
      },
    },
    (err) => {
      if (err) throw err;
      else {
        console.log("changed password");
        res.json({
          err: 0,
          success: true,
          message: "You Have Successfully Changed Your Password",
        });
      }
    }
  );
};
const changePassword = async (req, res) => {
  let { email, password, oldpassword } = req.body;
  const user = await userModel.findOne({ email: email });

  const validPassword = await bcrypt.compare(oldpassword, user.password);
  if (validPassword) {
    const hashpassword = bcrypt.hashSync(password, 10);
    userModel.updateOne(
      { email: email },
      {
        $set: {
          password: hashpassword,
        },
      },
      (err) => {
        if (err) throw err;
        else {
          console.log("changed password");
          res.json({
            err: 0,
            success: true,
            message: "You Have Successfully Changed Your Password",
          });
        }
      }
    );
  } else {
    res.json({ success: false, message: "Please Enter Correct Old Password" });
  }
  // const filename = `new${Math.random()}`;
};

function generateOTP() {
  var digits = "0123456789";

  var otpLength = 4;

  var otp = "";

  for (let i = 1; i <= otpLength; i++) {
    var index = Math.floor(Math.random() * digits.length);

    otp = otp + digits[index];
  }

  return otp;
}
const sendmailotp = (req, res) => {
  console.log(req.body);
  const { remail } = req.body;
  const otp = generateOTP();
  userModel.updateOne(
    { email: remail },
    {
      $set: {
        otp: otp,
      },
    },
    (err) => {
      if (err) throw err;
      else {
        res.json(otp);
        console.log("Otp stored in db");
      }
    }
  );
  sendmail(otp, remail);
};

const getUser = (req, res) => {
  const email = req.params.email;
  userModel.findOne({ email: email }, (err, data) => {
    if (err) throw err;
    else {
      res.json({ err: 0, success: true, status_code: 200, data: data });
    }
  });
};

const updateUser = (req, res) => {
  // console.log(req.files[0].filename)
  // const data = {
  //   fname: req.body.fname,
  //   lname: req.body.lname,
  //   email: req.body.email,
  //   mobile:req.body.mobile,
  //   dob:req.body.dob,
  //   gender:req.body.gender,
  //   pimg: req.files[0].filename,
  // };
  console.log(req.body)

  userModel.updateOne(
    // { email: req.body.pemail },
    
    { email: req.body.email },
    {
      $set: {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        mobile: req.body.mobile,
        dob: req.body.dob,
        gender: req.body.gender,
      },
    },
    (err) => {
      if (err) throw err;
      else {
        res.json({ msg: "Edit Done", err: 0, status_code: 200 });
        console.log("done");
      }
    }
  );
};
const addAddr = (req, res) => {
  const email = req.params.email;

  // console.log(req.files[0].filename)
  // const data = {
  //   fname: req.body.fname,
  //   lname: req.body.lname,
  //   email: req.body.email,
  //   mobile:req.body.mobile,
  //   dob:req.body.dob,
  //   gender:req.body.gender,
  //   pimg: req.files[0].filename,
  // };

  userModel.updateOne(
    { email: email },
    { $push: { addresses: req.body } },
    (err) => {
      if (err) throw err;
      else {
        res.json({ msg: "Address Added", err: 0, status_code: 200 });
        console.log("inside addadd");
      }
    }
  );
};

const updateImg = (req, res) => {
  userModel.updateOne(
    { email: req.body.pemail },
    { $set: { pimg: req.file.filename } },
    (err) => {
      if (err) throw err;
      else {
        res.json({ msg: "Edit Done", err: 0, status_code: 200 });
        console.log("done");
      }
    }
  )
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
    

  //   userModel.updateOne(
  //     { email: req.body.pemail },
  //     { $set: { pimg: req.files[0].filename } },
  //     (err) => {
  //       if (err) throw err;
  //       else {
  //         res.json({ msg: "Edit Done", err: 0, status_code: 200 });
  //         console.log("done");
  //       }
  //     }
  //   );
  // });
};
const getCustAddress = (req, res) => {
  const email = req.params.email;
  userModel.findOne({ email: email }, (err, data) => {
    if (err) throw err;
    else {
      res.json({
        err: 0,
        success: true,
        status_code: 200,
        data: data.addresses,
      });
    }
  });
};
const deleteAddr = (req, res) => {
  const email = req.params.email;

  // console.log(req.files[0].filename)
  // const data = {
  //   fname: req.body.fname,
  //   lname: req.body.lname,
  //   email: req.body.email,
  //   mobile:req.body.mobile,
  //   dob:req.body.dob,
  //   gender:req.body.gender,
  //   pimg: req.files[0].filename,
  // };

  userModel.updateOne(
    { email: email },
    { $pull: { addresses: { _id: req.body.id } } },
    (err) => {
      if (err) throw err;
      else {
        res.json({ msg: "Address Deleted", err: 0, status_code: 200 });
      }
    }
  );
};

const updAddr = (req, res) => {
  const email = req.params.email;
  const data = {
    address: req.body.address,
    city: req.body.city,
    pincode: req.body.pincode,
    state: req.body.state,
    country: req.body.country,
  };

  userModel.findOne({ email: email }).then((item) => {
    item.addresses[req.body.index] = data;
    item.save((err) => {
      console.log(err);
      if (err) {
        res.json({ err: 1, message: "Something Went Wrong" });
      } else {
        res.json({
          err: 0,
          success: true,
          status_code: 200,
          msg: "Successfully Updated",
        });
      }
    });
  });
};
module.exports = {
  login,
  signup,
  sendmailotp,
  updatePassword,
  changePassword,
  getUser,
  updateUser,
  updateImg,
  addAddr,
  getCustAddress,
  deleteAddr,
  updAddr,
  socLogin
};
