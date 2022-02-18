import React, { useState, useEffect, useRef } from "react";
import { Button, Row, Col, Container, Form } from "react-bootstrap";
import { getUser, updateUser } from "../../config/Myservice";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./EditProfile.css";
import {encryptStorage} from '../../config/EncryptStorage'

const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForName = /^[a-zA-Z ]{2,100}$/;
const regForMobile = RegExp(
  /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
);
function EditProfile() {
  const [edit, setedit] = useState(true);
  const [userdb, setUserdb] = useState("");
  const [useremail, setUseremail] = useState("");
  const reffname = useRef(null);
  const reflname = useRef(null);
  const refgender = useRef(null);
  const refmobile = useRef(null);
  const refemail = useRef(null);
  const refdob = useRef(null);
  const refpimg = useRef(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [alertmsg, setAlertmsg] = useState(false);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [errors, setErrors] = useState({
    fname: "",
    lname: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
  });
  useEffect(() => {
    
    const user = (encryptStorage.getItem("user"));
    const email = user.email;
    setUseremail(email);
    getUser(email).then((res) => {
      if (res.data.err == 0) {
        setUserdb(res.data.data);
        // console.log(res.data.data)
      }
    });
  }, []);
  const updateHandler = () => {
    let formData = new FormData(); //formdata object
    formData.append("fname", reffname.current.value); //append the values with key, value pair
    formData.append("lname", reflname.current.value);
    formData.append("mobile", refmobile.current.value);
    formData.append("email", refemail.current.value);
    formData.append("gender", refgender.current.value);
    formData.append("dob", refdob.current.value);
    formData.append("pemail", useremail);

    let data = {
      fname: reffname.current.value,
      lname: reflname.current.value,
      gender: refgender.current.value,
      mobile: refmobile.current.value,
      email: refemail.current.value,
      dob: refdob.current.value,
      pemail: useremail,
    };

    updateUser(data).then((res) => {
      if (res.data.err === 0) {
        // alert("Updated Successully");
        setAlertmsg("Updated Successully");
        setOpen(true);
        setedit(true);
      } else {
        // alert("Something Went Wrong");
        setAlertmsg("Something Went Wrong");
        setOpen2(true);
      }
    });

    console.log(refemail.current.value);
  };

  const handler = (event) => {
    const { name, value } = event.target;

    // let errors=state.errors;
    switch (name) {
      case "fname":
        let efname = regForName.test(value) ? "" : "Please Enter Valid Name";
        setErrors({ ...errors, fname: efname });
        console.log(value);
        break;
      case "lname":
        let elname = regForName.test(value) ? "" : "Please Enter Valid Name";
        setErrors({ ...errors, lname: elname });
        break;
      case "email":
        let eemail = regForEmail.test(value) ? "" : "Enter Valid Email";
        setErrors({ ...errors, email: eemail });
        break;
      case "mobile":
        let emobile = regForMobile.test(value) ? "" : "Enter Valid Mobile No";
        setErrors({ ...errors, mobile: emobile });

        break;

      default:
    }

    // setState({[name]:value},...state);

    // setErrors(errors)
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen2(false);
    setOpen(false);
  };

  return (
    <div className="card  text-start  editprofile">
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{ width: "100%", height: "100%" }}
        >
          {alertmsg}
        </Alert>
      </Snackbar>
      <Snackbar
        open={open2}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          sx={{ width: "100%", height: "100%" }}
        >
          {alertmsg}
        </Alert>
      </Snackbar>
      <div className="card-header">
        <h2 className="fontapply">Profile</h2>
      </div>
      <div className="card-body">
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              <b>FirstName</b>
            </Form.Label>
            <Col sm="9">
              <Form.Control
                plaintext={edit}
                disabled={edit}
                defaultValue={userdb.fname}
                ref={reffname}
                name="fname"
                onChange={handler}
              />
              {errors.fname && (
                <Form.Text style={{ color: "red" }}>{errors.fname}</Form.Text>
              )}
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              <b>LastName</b>
            </Form.Label>
            <Col sm="9">
              <Form.Control
                plaintext={edit}
                disabled={edit}
                defaultValue={userdb.lname}
                ref={reflname}
                name="lname"
                onChange={handler}
              />
              {errors.lname && (
                <Form.Text style={{ color: "red" }}>{errors.lname}</Form.Text>
              )}
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              <b>Gender</b>
            </Form.Label>
            <Col sm="9">
              <Form.Control
                plaintext={edit}
                disabled={edit}
                defaultValue={userdb.gender}
                ref={refgender}
                name="gender"
                onChange={handler}
              />

              {errors.gender && (
                <Form.Text style={{ color: "red" }}>{errors.gender}</Form.Text>
              )}
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              <b>Mobile No</b>
            </Form.Label>
            <Col sm="9">
              <Form.Control
                plaintext={edit}
                disabled={edit}
                defaultValue={userdb.mobile}
                ref={refmobile}
                name="mobile"
                onChange={handler}
              />
              {errors.mobile && (
                <Form.Text style={{ color: "red" }}>{errors.mobile}</Form.Text>
              )}
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              <b>Email</b>
            </Form.Label>
            <Col sm="9">
              <Form.Control
                plaintext={edit}
                disabled={edit}
                defaultValue={userdb.email}
                ref={refemail}
                name="email"
                onChange={handler}
              />
              {errors.email && (
                <Form.Text style={{ color: "red" }}>{errors.email}</Form.Text>
              )}
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              <b>Date Of Birth</b>
            </Form.Label>
            <Col sm="9">
              <Form.Control
                type="date"
                name="dob"
                id="dob"
                ref={refdob}
                disabled={edit}
                defaultValue={userdb.dob}
              />
            </Col>
          </Form.Group>
        </Form>
      </div>
      <div className="card-footer text-muted">
        {edit ? (
          <Button onClick={() => setedit(false)} variant="outline-dark">
            <i className="fa fa-edit"></i> Edit
          </Button>
        ) : (
          <Button onClick={() => updateHandler()}>Update</Button>
        )}
      </div>
    </div>
  );
}

export default EditProfile;
