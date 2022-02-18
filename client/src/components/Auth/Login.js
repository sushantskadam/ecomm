import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
import SocialButton from "./SocialButton";
import { login, getUser, SocLogin, getCartd } from "../../config/Myservice";
import "./Login.css";
import { useDispatch } from "react-redux";
import HashLoader from "react-spinners/HashLoader";
import {
  Button,
  Row,
  Col,
  Form,
  Container,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {encryptStorage} from '../../config/EncryptStorage'
const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

const regForPassword = RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

function Login() {
  //   const dispatch = useDispatch();
  const dispatch = useDispatch();

  const [userdata, setUserdata] = useState([]);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
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
    // countcalc();
    dispatch({ type: "countcalc" });

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
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
  const handler = (event) => {
    const { name, value } = event.target;

    // let errors=state.errors;
    switch (name) {
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
    // console.log(userdata);
    event.preventDefault();
    // setUser({ ...user, cource: selectedc });
    if (validate(errors) && user.email && user.password) {
      // securePassword(cred.password)
      login(user).then((res, err) => {
        // console.log(res.status);
        if (res.data.err === 0) {
          // console.log(res.data);
          let login = user.email;
          let array = JSON.parse(localStorage.getItem("cart"));

          getCartd(user.email).then(async (res, err) => {
            // console.log(res.data.data);
            if (JSON.parse(localStorage.getItem("cart"))) {
              // let array = JSON.parse(localStorage.getItem("cart"));
              // function itemExists (id) {
              //   return resdata.some(function (el) {
              //     return el.id === id;
              //   });
              // }
              //   // if (itemExists(val.id)) {
              //   //  await array.splice(i, 1);
              //   // }

              // array.map((val, i) => {
              // if (
              //   resdata.filter(function (e) {
              //     return e.id === val.id;
              //   })
              // ) {
              //   array.splice(i, 1);
              // }

              //   // const found = resdata.some(item => item.id == val.id);
              //   // if (found) {
              //   //   arr.splice(i, 1);
              //   //   console.log(found)

              //   // }

              //   // console.log(val.id)
              // if (resdata.filter(e => e.id === val.id)) {
              //   let index=arr.indexOf(val)
              //    arr.splice(index,1);
              // }

              // });
              let resdata = res.data.data.products;

              let result = array.concat(resdata);
              let map = new Map();
              // Removing duplicates items
              result.forEach((item) => {
                if (!map.has(item.id)) {
                  map.set(item.id, item);
                }
              });

              Array.from(map.values());
              // const uparray = array.concat(resdata);
              console.log(Array.from(map.values()));
              localStorage.setItem(
                "cart",
                JSON.stringify(Array.from(map.values()))
              );

              // console.log(array.concat(res.data.data.products));
            } else {
              localStorage.setItem(
                "cart",
                JSON.stringify(res.data.data.products)
              );
            }
            // countcalc();
            dispatch({ type: "countcalc" });


            // array.push(res.data.data.products)
          });

          //   history.push("/dashboard");
          // console.log("logged in");

          encryptStorage.setItem("user", JSON.stringify(res.data.user));
          

          localStorage.setItem("_token", res.data.token);

          localStorage.setItem("login", JSON.stringify(login));
          dispatch({ type: "isuser" });
          dispatch({ type: "session_logout" });



          if (res.data.user.role === "admin") {
            navigate("/admin");
            localStorage.removeItem("cart");

          } else {
            navigate("/");
          }
        } else if (res.data.err === 1) {
          // alert(res.data.msg);
          setAlertmsg(res.data.msg);
          setOpen(true);
        } else if (res.data.err === 2) {
          // alert(res.data.msg);
          setAlertmsg(res.data.msg);
          setOpen(true);
        } else if (res.data.err === 3) {
          // alert("You Are Already Registered with Social Login");
          setAlertmsg("You Are Already Registered with Social Login");
          setOpen(true);
        }
      });
      // userdata.map((data, i) => {
      //   const passwordmatch = bcrypt.compare(user.password, data.password);
      //   console.log(user.username);
      //   if (
      //     (data.email === user.username || data.username === user.username) &&
      //     passwordmatch
      //   ) {
      //     ver = true;
      //     localStorage.setItem("index", JSON.stringify(i));
      //     dispatch({ type: "index", payload: i });
      //   }
      // });
      // if (ver) {
      //   let login = user.username;
      //   navigate("/dashboard");
      //   //   history.push("/dashboard");
      //   console.log("logged in");
      //   localStorage.setItem("login", JSON.stringify(login));
      // } else {
      //   alert("Username/Email or Password is wrong");
      // }
    } else {
      // alert("Please Enter Valid Data");
      setAlertmsg("Please Enter Valid Data");
      setOpen(true);
    }
  };
  const validate = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };
  const handleSocialLogin = (user) => {
    console.log(user);
    setUserdata(user._profile);
    if (user) {
      SocLogin(user._profile).then((res) => {
        if (res.data.err === 2) {
          console.log(res.data.message);
          localStorage.setItem("login", JSON.stringify(user._profile.email));
          encryptStorage.setItem("user", JSON.stringify(res.data.data));
          localStorage.setItem("_token", res.data.token);
          getCartd(user._profile.email).then((res, err) => {
            console.log(res.data.data);
            if (JSON.parse(localStorage.getItem("cart"))) {
              let array = JSON.parse(localStorage.getItem("cart"));
              function itemExists(id) {
                return res.data.data.products.some(function (el) {
                  return el.id === id;
                });
              }
              array.forEach((val, i) => {
                if (itemExists(val.id)) {
                  array.splice(i, 1);
                }
              });

              console.log(array.concat(res.data.data.products));
              const uparray = array.concat(res.data.data.products);
              localStorage.setItem("cart", JSON.stringify(uparray));
            } else {
              localStorage.setItem(
                "cart",
                JSON.stringify(res.data.data.products)
              );
            }

            // array.push(res.data.data.products)
          });
          navigate("/");
        } else if (res.data.err === 0) {
          localStorage.setItem("login", JSON.stringify(user._profile.email));
          encryptStorage.setItem("user", JSON.stringify(user._profile));
          localStorage.setItem("_token", res.data.token);
          navigate("/");
        }
        // countcalc();
        dispatch({ type: "countcalc" });

      });
    }
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleSocialLoginFailure = (err) => {
    console.error(err);
  };

  if (encryptStorage.getItem("user")) {
    return <> {navigate("/")}</>;
  } else {
    return (
      <div className="mt-5 ">
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
              autoHideDuration={6000}
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
            <Row>
             <Col xl={5}>
                {" "}
                <br />
                <br />
                <SocialButton
                  provider="facebook"
                  appId="582030492904262"
                  onLoginSuccess={handleSocialLogin}
                  onLoginFailure={handleSocialLoginFailure}
                  className="btn btn-primary button1 buttonadjust"
                  // style={{ width: "300px" }}
                >
                  <i className="fa fa-facebook" aria-hidden="true">
                    {" "}
                  </i>{" "}
                  Login with Facebook
                </SocialButton>
                &nbsp;
                <br />
                <br />
                <SocialButton
                  provider="google"
                  appId="744649355195-q6dfeej85fe3qcu9oupr41e1ap971c6t.apps.googleusercontent.com"
                  onLoginSuccess={handleSocialLogin}
                  onLoginFailure={handleSocialLoginFailure}
                  className="btn btn-danger button1 btn1"
                  // style={{ width: "300px" }}
                >
                  <i className="fa fa-google" aria-hidden="true">
                    {" "}
                  </i>{" "}
                  Login with Gmail
                </SocialButton>
                <br />
                <br />
              </Col>
              <Col xl={6} className="formadjust">
                <h1 className="fontapply">Login to NeoSTORE</h1>
                <Form id="myForm mt-2">
                  <Form.Group>
                    <Row className="justify-content-md-center">
                      <Col xs lg="9">
                        <Form.Label></Form.Label>
                        <InputGroup className="mb-2">
                          <InputGroup.Text>@</InputGroup.Text>

                          <FormControl
                            type="text"
                            placeholder="Enter Email"
                            name="email"
                            id="email"
                            onChange={handler}
                            isValid={user.email !== "" ? true : false}
                            isInvalid={errors.email !== "" ? true : false}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </InputGroup>

                        {/* {errors.username && (
                  <Form.Text style={{ color: "red" }}>
                    {errors.username}
                  </Form.Text>
                )} */}
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label></Form.Label>
                    <Row className="justify-content-md-center">
                      <Col xs lg="9">
                        <Form.Control
                          type="password"
                          placeholder="Enter Password"
                          name="password"
                          id="password"
                          onChange={handler}
                          isValid={user.password !== "" ? true : false}
                          isInvalid={errors.password !== "" ? true : false}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.username}
                        </Form.Control.Feedback>
                        {/* {errors.password && (
                  <Form.Text style={{ color: "red" }}>
                    {errors.password}
                  </Form.Text>
                )} */}
                      </Col>
                    </Row>
                  </Form.Group>

                  <br />

                  <Form.Group>
                    <Button
                      // variant="outline-dark"
                      type="submit"
                      onClick={formSubmit}
                      className="submitBtnlogin"
                    >
                      Log In
                    </Button>
                  </Form.Group>
                  <br />
                  <a
                    className="small text-muted pt-4"
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => navigate("/forgotpassword")}
                  >
                    Forgot password?
                  </a>
                  <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                    Don't have an account?{" "}
                    <a
                      onClick={() => navigate("/signup")}
                      style={{
                        color: "#393f81",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      Register here
                    </a>
                  </p>
                </Form>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    );
  }
}

export default Login;
