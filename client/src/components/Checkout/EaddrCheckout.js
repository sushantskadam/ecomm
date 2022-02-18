import React, { useState, useEffect, useRef } from "react";
import { Button, Row, Col, Container, Form } from "react-bootstrap";
import { updateAddr, getCustAddress } from "../../config/Myservice";
import { useNavigate } from "react-router-dom";
// import "./EditProfile.css";
import AddrCheckout from "./AddrCheckout";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
const regForName = /^[a-zA-Z ]{2,100}$/;

// import Address from "./Address";
function EaddrCheckout({ setShowedit, showedit, addr, index, setAlladdr }) {
  const navigate = useNavigate();

  const [edit, setedit] = useState(true);
  const [userdb, setUserdb] = useState("");
  const [useraddr, setUseraddr] = useState([]);
  //   const [showadd, setShowadd] = useState(true)
  const refaddress = useRef(null);
  const refpincode = useRef(null);
  const refcity = useRef(null);
  const refstate = useRef(null);
  const refcountry = useRef(null);
  const [errors, setErrors] = useState({
    address: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
  });
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [alertmsg, setAlertmsg] = useState(false);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  useEffect(() => {
    
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user.email;

    // getAddr(email,id).then((res) => {
    //     if (res.data.err == 0) {
    //       setUseraddr(res.data.data);
    //       console.log(res.data.data)
    //     }
    //   });
  }, []);
  const updateAddHandler = () => {
    if (
      validate(errors) &&
      refaddress.current.value &&
      refpincode.current.value &&
      refcity.current.value &&
      refpincode.current.value &&
      refstate.current.value &&
      refcountry.current.value
    ) {
      let data = {
        address: refaddress.current.value,
        pincode: refpincode.current.value,
        city: refcity.current.value,
        pincode: refpincode.current.value,
        city: refcity.current.value,
        state: refstate.current.value,
        country: refcountry.current.value,
        id: addr._id,
        index: index,
      };
      console.log(data);
      const user = JSON.parse(localStorage.getItem("user"));
      const email = user.email;
      updateAddr(data, email).then((res) => {
        if (res.data.err === 0) {
          // alert("Address Updated Successfully");
          setAlertmsg("Address Updated Successfully");
          setOpen(true);
          getCustAddress(email).then((res) => {
            if (res.data.err == 0) {
              setAlladdr(res.data.data);
            }
          });
          setTimeout(() => {
            setShowedit(false);
          }, 1000);
          document.getElementById("editform").reset();
        } else {
          // alert("Something Went Wrong");
          setAlertmsg("Something Went Wrong");
          setOpen2(true);
        }
      });
    } else {
      // alert("Please Enter Valid Data");
      setAlertmsg("Please Enter Valid Data");
      setOpen2(true);
    }
  };
  const handler = (event) => {
    const { name, value } = event.target;

    // let errors=state.errors;
    switch (name) {
      case "address":
        let eaddress = value.length > 10 ? "" : "Min 10 Characters";
        setErrors({ ...errors, address: eaddress });
        console.log(value);
        break;
      case "pincode":
        let epincode = value.length > 4 ? "" : "Please Enter Valid Pincode";
        setErrors({ ...errors, pincode: epincode });
        break;
      case "city":
        let ecity = regForName.test(value) ? "" : "Enter Valid City Name";
        setErrors({ ...errors, city: ecity });
        break;
      case "state":
        let estate = regForName.test(value) ? "" : "Enter Valid State Name";
        setErrors({ ...errors, state: estate });

        break;

      case "country":
        let ecountry = regForName.test(value) ? "" : "Enter Valid Country Name";
        setErrors({ ...errors, country: ecountry });
        break;

      default:
    }
  };
  const validate = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen2(false);
    setOpen(false);
  };
  if (showedit) {
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
          <h2 className="fontapply">Update Address</h2>
        </div>
        <div className="card-body mt-2">
          <Form id="editform">
            <Form.Group
              as={Row}
              className="mb-4"
              controlId="formPlaintextEmail"
            >
              <Col sm={7}>
                {/* <Form.Label for="inputAddress">Address</Form.Label> */}
                <Form.Control
                  as="textarea"
                  type="text"
                  className="form-control"
                  id="inputAddress"
                  name="address"
                  placeholder="Address"
                  rows={3}
                  ref={refaddress}
                  defaultValue={addr.address}
                  onChange={handler}
                />
                {errors.address && (
                  <Form.Text style={{ color: "red" }}>
                    {errors.address}
                  </Form.Text>
                )}
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              className="mb-4"
              controlId="formPlaintextEmail"
            >
              <Col sm={6}>
                {/* <Form.Label for="inputAddress">Address</Form.Label> */}
                <Form.Control
                  type="number"
                  className="form-control"
                  id="inputAddress"
                  placeholder="PinCode"
                  name="pincode"
                  ref={refpincode}
                  defaultValue={addr.pincode}
                  onChange={handler}
                />
                {errors.pincode && (
                  <Form.Text style={{ color: "red" }}>
                    {errors.pincode}
                  </Form.Text>
                )}
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              className="mb-4"
              controlId="formPlaintextEmail"
            >
              <Col sm={5}>
                {/* <Form.Label for="inputAddress">Address</Form.Label> */}
                <Form.Control
                  type="text"
                  className="form-control"
                  id="inputAddress"
                  placeholder="City"
                  name="city"
                  ref={refcity}
                  defaultValue={addr.city}
                  onChange={handler}
                />
                {errors.city && (
                  <Form.Text style={{ color: "red" }}>{errors.city}</Form.Text>
                )}
              </Col>{" "}
              &nbsp;
              <Col sm={5}>
                {/* <Form.Label for="inputAddress">Address</Form.Label> */}
                <Form.Control
                  type="text"
                  className="form-control"
                  id="inputAddress"
                  placeholder="State"
                  name="state"
                  ref={refstate}
                  defaultValue={addr.state}
                  onChange={handler}
                />
                {errors.state && (
                  <Form.Text style={{ color: "red" }}>{errors.state}</Form.Text>
                )}
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              className="mb-4"
              controlId="formPlaintextEmail"
            >
              <Col sm={6}>
                {/* <Form.Label for="inputAddress">Address</Form.Label> */}
                <Form.Control
                  type="text"
                  className="form-control"
                  id="inputAddress"
                  placeholder="Country"
                  name="country"
                  ref={refcountry}
                  defaultValue={addr.country}
                  onChange={handler}
                />
                {errors.country && (
                  <Form.Text style={{ color: "red" }}>
                    {errors.country}
                  </Form.Text>
                )}
              </Col>
            </Form.Group>
          </Form>
        </div>
        <div className="card-footer text-muted">
          <Button onClick={() => updateAddHandler()} variant="outline-dark">
            <i className="fa fa-save"></i> Update
          </Button>
          &nbsp; &nbsp;
          <Button onClick={() => setShowedit(false)} variant="outline-dark">
            Cancel
          </Button>
          &nbsp; &nbsp;
        </div>
      </div>
    );
  } else {
    return <AddrCheckout />;
  }
}

export default EaddrCheckout;
