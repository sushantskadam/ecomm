import React, { useState, useEffect } from "react";
import { sendMailotp, updatePassword } from "../../config/Myservice";
import {
  Button,
  Row,
  Col,
  Form,
  Container,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {encryptStorage} from '../../config/EncryptStorage'

// import bcryptjs from 'bcryptjs';
const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

const regForPassword = RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

function ForgotPassword() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    otp: "",
    password: "",
    repeatpassword: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    otp: "",
    password: "",
    repeatpassword: "",
    email: "",
  });
  const [userdata, setuserdata] = useState();
  const [genOTP, setgenOTP] = useState();
  const [otpsent, setotpsent] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [alertmsg, setAlertmsg] = useState(false);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  useEffect(() => {
    
    const userdata = JSON.parse(encryptStorage.getItem("user"));
    setuserdata(userdata);
    // const otp = generateOTP();
    // setgenOTP(otp);
    // let remail = userdata.email;
    // sendMailotp({ otp, remail });
    // console.log(otp);
  }, []);

  const handler = (event) => {
    const { name, value } = event.target;

    // let errors=state.errors;
    switch (name) {
      case "otp":
        let eotp =
          value.length > 3 && value.length < 5 ? "" : "Enter 4 Digit OTP";
        setErrors({ ...errors, otp: eotp });
        break;
      case "email":
        let eemail = regForEmail.test(value) ? "" : "Enter Valid Email";
        setErrors({ ...errors, email: eemail });
        break;
      case "password":
        let epassword = regForPassword.test(value)
          ? ""
          : "Enter Valid Password";
        setErrors({ ...errors, password: epassword });
        break;
      case "repeatpassword":
        console.log(user.password);
        console.log(value);
        let erepeatpassword =
          value !== user.password ? "Password Dont Match" : "";
        setErrors({ ...errors, repeatpassword: erepeatpassword });
        break;

      // case "myImage":
      //     let emyImage = value.length > 1 ? "" : "Select a Logo";
      //     setErrors({ ...errors, myImage: emyImage });
      //     break;

      default:
    }
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // setState({[name]:value},...state);

    // setErrors(errors)
  };

  const formSubmit = async (event) => {
    event.preventDefault();
    // setUser({ ...user, cource: selectedc });
    if (validate(errors) && user.password && user.repeatpassword) {
      // securePassword(cred.password)
      // const passwordHash = await bcrypt.hash(user.password,10);

      console.log(user);
      if (user.otp === genOTP) {
        let email = user.email;
        let password = user.password;
        updatePassword({ email, password }).then((res, err) => {
          console.log(err);
          // alert("Password Successfully Updated");
          setAlertmsg("Password Successfully Updated");
          setOpen(true);

          localStorage.removeItem("login");
          localStorage.removeItem("user");
          localStorage.removeItem("_token");
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        });
      } else {
        // alert("Wrong Otp");
        setAlertmsg("Wrong OTP");
        setOpen2(true);
      }
      // addSignup(user).then((res) => {
      //   if (res.data.err === 0) {
      //     alert("Registered Succesfully");
      //     navigate("/login");
      //   } else if (res.data.err === 2) {
      //     alert("User Already Exist. Please Login");
      //     navigate("/login");
      //   }
      // });

      document.getElementById("myForm").reset();
    } else {
      // alert("Please Enter Valid Data");
      setAlertmsg("Please Enter Valid Data");
      setOpen2(true);
    }
  };
  const validate = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };
  const sendotp = () => {
    // const otp = generateOTP();
    // setgenOTP(otp);
    let remail = user.email;
    sendMailotp({ remail }).then((res, err) => {
      // console.log(res.data)
      setgenOTP(res.data);
    });
    setotpsent(true);
  };
  const sendotpagain = () => {
    // const otp = generateOTP();
    // setgenOTP(otp);
    let remail = user.email;
    sendMailotp({ remail }).then((res, err) => {
      // console.log(res.data)
      setgenOTP(res.data);
    });
    setAlertmsg("OTP Sent Again")
    setOpen(true)
    setotpsent(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen2(false);
    setOpen(false);
  };

  return (
    <div>
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
      <Container className=" mt-3 ">
        <div className="formadjustforgot">
          <Form id="myForm  ">
            <h1 className="fontapply">Forgot Password</h1>
            <br />
            <Row className="justify-content-md-center ">
              {!otpsent ? (
                <Form.Group>
                  <Row className="justify-content-md-center">
                    <Col xs lg="8">
                      <Form.Label></Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter Your Email"
                        name="email"
                        id="email"
                        onChange={handler}
                        isValid={user.email !== "" ? true : false}
                        isInvalid={errors.email !== "" ? true : false}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>

                      <Button
                        onClick={sendotp}
                        variant="success"
                        className="float-right mt-2"
                        size="sm"
                      >
                        Send OTP
                      </Button>

                      {/* {errors.email && (
                    <Form.Text style={{ color: "red" }}>
                      {errors.email}
                    </Form.Text>
                  )} */}
                    </Col>
                  </Row>
                </Form.Group>
              ) : (
                <>
                <Row>
                  <Col sm={12} className="justify-content-center">
                    <div className="alert alert-info" role="alert">
                      OTP has been sent to your Registered Email ID
                    </div>
                  </Col>
                  </Row>
                  <Row>
                  <Col sm={12}>
                    <Button
                      onClick={sendotpagain}
                      variant="success"
                      className=""
                      size="xs"
                    >
                      Send Again
                    </Button>
                  </Col>
                </Row>
                </>
              )}

              <br />
            </Row>

            <Form.Group>
              <Row className="justify-content-md-center">
                <Col xs lg="8">
                  <Form.Label></Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter OTP"
                    name="otp"
                    id="otp"
                    onChange={handler}
                    isValid={user.otp !== "" ? true : false}
                    isInvalid={errors.otp !== "" ? true : false}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.otp}
                  </Form.Control.Feedback>

                  {/* {errors.email && (
                    <Form.Text style={{ color: "red" }}>
                      {errors.email}
                    </Form.Text>
                  )} */}
                </Col>
              </Row>
            </Form.Group>

            <Form.Group>
              <Form.Label></Form.Label>

              <Row className="justify-content-md-center">
                <Col xs lg="8">
                  <Form.Control
                    type="password"
                    placeholder="Enter New Password"
                    name="password"
                    id="password"
                    onChange={handler}
                    isValid={user.password !== "" ? true : false}
                    isInvalid={errors.password !== "" ? true : false}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                  {/* {errors.password && (
                    <Form.Text style={{ color: "red" }}>
                      {errors.password}
                    </Form.Text>
                  )} */}
                </Col>
              </Row>
              <br />
              <Row className="justify-content-md-center">
                <Col xs lg="8">
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    name="repeatpassword"
                    id="repeatpassword"
                    onChange={handler}
                    isValid={user.repeatpassword !== "" ? true : false}
                    isInvalid={errors.repeatpassword !== "" ? true : false}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.repeatpassword}
                  </Form.Control.Feedback>
                  {/* {errors.repeatpassword && (
                    <Form.Text style={{ color: "red" }}>
                      {errors.repeatpassword}
                    </Form.Text>
                  )} */}
                </Col>
              </Row>
            </Form.Group>
            <br />

            <br />
            <Form.Group>
              <Button variant="primary" type="submit" onClick={formSubmit}>
                Submit
              </Button>
            </Form.Group>
            <br />
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default ForgotPassword;
