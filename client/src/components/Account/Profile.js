import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Row, Col, Container, Form } from "react-bootstrap";
import ChangePassword from "./ChangePassword";
import "./Profile.css";
import EditProfile from "./EditProfile";
import { getUser, updateImg } from "../../config/Myservice";
import Address from "./Address";
import AddAddress from "./AddAddress";
import EditAddress from "./EditAddress";
import Orders from "./Orders";
import HashLoader from "react-spinners/HashLoader";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {encryptStorage} from '../../config/EncryptStorage'

const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

const regForPassword = RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

function Profile() {
  //   const dispatch = useDispatch();
  const [user, setUser] = useState();
  const [rightComp, setRightComp] = useState(<EditProfile />);
  const [useremail, setUseremail] = useState();
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const refpimg = useRef(null);
  const [addressshow, setAddressshow] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [alertmsg, setAlertmsg] = useState(false);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const override = `
  display: block;
  margin: 230px auto;
  border-color: red;
`;
  useEffect(() => {
    
    const user = (encryptStorage.getItem("user"));
    const email = user.email;

    getUser(email).then((res) => {
      if (res.data.err == 0) {
        setUser(res.data.data);
        // console.log(res.data.data.pimg);
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    });
    // countcalc();
    dispatch({ type: "countcalc" });

  }, []);
  const imgupHandler = () => {
    let formData = new FormData(); //formdata object
    const user = (encryptStorage.getItem("user"));
    const email = user.email;
    var pimg = document.querySelector('input[type="file"]').files[0];
    formData.append("myfile", pimg);
    formData.append("pemail", email);

    const config = {
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=AaB03x" +
          "--AaB03x" +
          "Content-Disposition: file" +
          "Content-Type: png" +
          "Content-Transfer-Encoding: binary" +
          "...data... " +
          "--AaB03x--",
        Accept: "application/json",
        type: "formData",
        Authentication: `Bearer ${localStorage.getItem("_token")}`,
      },
    };
    console.log(formData);
    // let data = {
    //   fname: reffname.current.value,
    //   lname: reflname.current.value,
    //   gender: refgender.current.value,
    //   mobile: refmobile.current.value,
    //   email: refemail.current.value,
    //   dob: refdob.current.value,
    //   pimg: refpimg.current.value,
    // };

    updateImg(formData).then((res) => {
      if (res.data.err === 0) {
        // alert("Updated Successully");
        setAlertmsg("Updated Successully");
        setOpen(true);
        getUser(email).then((res) => {
          if (res.data.err == 0) {
            setUser(res.data.data);
          }
        });
        // setEdit(true)
      } else {
        // alert("Something Went Wrong");
        setAlertmsg("Something Went Wrong");
        setOpen2(true);
      }
    });
    setEdit(false);
  };
  const addressClick = () => {
    setRightComp(<Address />);
    setAddressshow(true);
  };
  const profileClicked = () => {
    setRightComp(<EditProfile />);
    setAddressshow(false);
  };
  const changepassClicked = () => {
    setRightComp(<ChangePassword />);
    setAddressshow(false);
  };
  const ordersClicked = () => {
    setRightComp(<Orders />);
    setAddressshow(false);
  };
  // const countcalc = () => {
  //   let array = JSON.parse(localStorage.getItem("cart"));
  //   if (array) {
  //     const count = array
  //       .map((item) => Number(item.quantity))
  //       .reduce((prev, curr) => prev + curr, 0);
  //     // console.log("count"+count)
  //     dispatch({ type: "count", payload: count });
  //     console.log(count);
  //   }
  // };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen2(false)
    setOpen(false);
  };

  if (user) {
    return (
      <div className="mt-1">
        {loading ? (
          <HashLoader
            color={"#D73636"}
            loading={loading}
            css={override}
            size={150}
          />
        ) : (
          <Container>
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
            <h2 className="text-start fontapply">My Account</h2>
            <hr />
            <Row className="mt-2">
              <Col lg={4}>
                <div className="card text-center pb-3 pt-3">
                  {/* <div className="card-header">Profile</div> */}
                  <div className="card-body">
                    {user.pimg ? (
                      <img
                        // src={`http://localhost:9999/${user.pimg}`}
                        src={
                          !user.soclogin
                            ? `http://localhost:9999/${user.pimg}`
                            : `${user.pimg}`
                        }
                        width={120}
                        height={110}
                        className="rounded-circle"
                        alt="Profile Img"
                      />
                    ) : (
                      <img
                        src="https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
                        width={120}
                        height={110}
                        className="rounded-circle"
                        alt="Profile Img"
                      />
                    )}
                    <br />
                    <br />
                    {edit ? (
                      <div>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label>
                            <b>Profile Picture</b>
                          </Form.Label>
                          <Col>
                            <Form.Control
                              type="file"
                              size="sm"
                              //  ref={refpimg}
                              className="w-75 ml-5"
                            />
                          </Col>
                        </Form.Group>
                        <Button
                          variant="outline-dark"
                          size="sm"
                          onClick={() => imgupHandler()}
                        >
                          Update Profile Picture
                        </Button>
                        <br />
                      </div>
                    ) : (
                      <Button
                        variant="outline-dark"
                        onClick={() => setEdit(true)}
                        style={{ fontSize: "15px" }}
                      >
                        {" "}
                        <i className="fa fa-edit"></i>
                      </Button>
                    )}
                    <br />
                    <h3 className="card-title mt-2">
                      {user.fname} {user.lname}
                    </h3>
                    <p className="card-text"></p>
                    {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
                    <Button
                      variant="outline-danger"
                      className="profilebttn"
                      onClick={() => ordersClicked()}
                    >
                      <i className="fa fa-bars" aria-hidden="true"></i> Orders
                    </Button>{" "}
                    <br />
                    <Button
                      variant="outline-danger"
                      className="profilebttn"
                      onClick={() => profileClicked()}
                    >
                      <i className="fa fa-user-circle" aria-hidden="true"></i>{" "}
                      Profile
                    </Button>{" "}
                    <br />
                    <Button
                      variant="outline-danger"
                      className="profilebttn"
                      onClick={() => addressClick()}
                    >
                      <i
                        className="fa fa-address-book-o"
                        aria-hidden="true"
                      ></i>{" "}
                      Address
                    </Button>{" "}
                    <br />
                    {addressshow && (
                      <Button
                        variant="outline-danger"
                        className="profilebttn"
                        onClick={() => setRightComp(<AddAddress />)}
                      >
                        <i className="fa fa-plus" aria-hidden="true"></i> Add
                        New Address
                      </Button>
                    )}
                    <Button
                      variant="outline-danger"
                      className="profilebttn"
                      onClick={() => changepassClicked()}
                    >
                      <i className="fa fa-key"></i> Change Password
                    </Button>{" "}
                    <br />
                  </div>
                  {/* <div className="card-footer text-muted">2 days ago</div> */}
                </div>
              </Col>
              <Col lg={8} lg={{ offset: 1 }}>
                {rightComp}
              </Col>
            </Row>
          </Container>
        )}

        <br />
      </div>
    );
  } else {
    return <> {navigate("/login")}</>;
  }
}

export default Profile;
