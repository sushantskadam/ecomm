import React, { useEffect, useState } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { delCart, checkoutOrder } from "../../config/Myservice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddrCheckout from "./AddrCheckout";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import GooglePayButton from "@google-pay/button-react";
import axios from "axios";
import "./Checkout.css";
import { encryptStorage } from "../../config/EncryptStorage";
function Checkout() {
  const [cartitems, setCartitems] = useState([]);
  const [subtotal, setsubtotal] = useState();
  const [gst, setgst] = useState();
  const [total, settotal] = useState();
  const [email, setemail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedaddr, setselectedaddr] = useState();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [user, setuser] = useState({});
  const [alertmsg, setAlertmsg] = useState(false);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [buttonColor, setButtonColor] = useState("default");
  const [buttonType, setButtonType] = useState("buy");
  const [buttonSizeMode, setButtonSizeMode] = useState("static");
  const [buttonWidth, setButtonWidth] = useState(320);
  const [buttonHeight, setButtonHeight] = useState(50);
  const paymentRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: "CARD",
        parameters: {
          allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
          allowedCardNetworks: ["MASTERCARD", "VISA"],
        },
        tokenizationSpecification: {
          type: "PAYMENT_GATEWAY",
          parameters: {
            gateway: "example",
          },
        },
      },
    ],
    merchantInfo: {
      merchantId: "12345678901234567890",
      merchantName: "Demo Merchant",
    },
    transactionInfo: {
      totalPriceStatus: "FINAL",
      totalPriceLabel: "Total",
      totalPrice: "100.00",
      currencyCode: "USD",
      countryCode: "US",
    },
  };
  useEffect(() => {
    
    const user = encryptStorage.getItem("user");
    const email = user.email;
    setuser(user);
    setemail(email);
    let array = JSON.parse(localStorage.getItem("cart"));
    setCartitems(array);
    totalcalc();
    // getCartd(email).then((res) => {
    //   setCartitems(res.data.data);
    //   totalcalc()
    //   const count =  cartitems.map(item => Number(item.quantity)).reduce((prev, curr) => prev + curr, 0);
    // //   console.log("count"+count)
    //   dispatch({ type: "count", payload: count });

    // });
    if (localStorage.getItem("selectedaddr")) {
      const selectedadd = JSON.parse(localStorage.getItem("selectedaddr"));
      setselectedaddr(selectedadd);
    }
  }, []);
  const totalcalc = () => {
    let subtotal = 0;
    let array = JSON.parse(localStorage.getItem("cart"));
    array.forEach((data) => {
      subtotal = subtotal + data.quantity * data.product_cost;
    });

    setsubtotal(subtotal);
    let gstcalc = (5 / 100) * subtotal;

    setgst(Math.round(gstcalc));
    settotal(subtotal + Math.round(gstcalc));
    // console.log(subtotal + Math.round(gstcalc));
  };

  const placeOrder = (paymentdetails) => {
    if (localStorage.getItem("selectedaddr")) {
      const selectedadd = JSON.parse(localStorage.getItem("selectedaddr"));
      setselectedaddr(selectedadd);
      totalcalc();
    }

    //   let order={cartitems:cartitems,subtotal:subtotal,gst:gst,total:total,email:email}
    //   localStorage.setItem("order", JSON.stringify(order));
    //   navigate("/checkout")
    const user = encryptStorage.getItem("user");
    if (localStorage.getItem("selectedaddr")) {
      const selectedadd = JSON.parse(localStorage.getItem("selectedaddr"));

      let data = {
        user: user,
        cartitems: cartitems,
        total: total,
        address: selectedadd,
        paymentdetails:paymentdetails
      };
      console.log(data);
      checkoutOrder(data).then((res) => {
        if (res.data.err === 0) {
          localStorage.removeItem("selectedaddr");

          // alert("Order Placed Successfully");
          setAlertmsg("Order Placed Successfully");
          setOpen2(true);
          delCart(user.email);
          localStorage.removeItem("cart");
          dispatch({ type: "count", payload: 0 });
          setTimeout(() => {
            navigate("/products");
          }, 2000);
        } else {
          // alert("Something Went Wrong");
          setAlertmsg("Something Went Wrong");
          setOpen(true);
        }
      });
    } else {
      // alert("Please Select a Address");
      setAlertmsg("Please Select a Address");
      setOpen(true);
    }
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen2(false);
    setOpen(false);
  };
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }
  async function displayRazorpay() {
    if (localStorage.getItem("selectedaddr")) {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      // creating a new order
      let data = { total: total };
      const result = await axios.post("http://localhost:9999/orders", data);

      if (!result) {
        alert("Server error. Are you online?");
        return;
      }

      // Getting the order details back
      const { amount, id: order_id, currency } = result.data;
      console.log(result.data);
      const options = {
        key: "rzp_test_FCFyML0ToVDrtO", // Enter the Key ID generated from the Dashboard
        amount: amount.toString(),
        currency: currency,
        name: "NeoSoft Tech",
        description: "Test Transaction",
        // image: { logo },
        order_id: order_id,
        handler: async function (response) {
          const data = {
            orderCreationId: order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const result = await axios.post(
            "http://localhost:9999/success",
            data
          );

          // alert(result.data.msg);
          // setAlertmsg(`${result.data.msg} & Order Placed`);
          // setOpen(true);
          console.log(result);
          placeOrder(data);
        },
        prefill: {
          name: `${user.fname} ${user.lname}`,
          email: user.email,
          contact: user.mobile,
        },
        notes: {
          address: "Neosoft Office",
        },
        theme: {
          color: "#61dafb",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } else {
      // alert("Please Select a Address");
      setAlertmsg("Please Select a Address");
      setOpen(true);
    }
  }

  return (
    <div>
      <div className="mt-2">
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
          <Snackbar
            open={open2}
            autoHideDuration={6000}
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
          <h2 className="text-start fontapply">Checkout</h2>
          <hr />
          <Row className="mt-3">
            <Col lg={8}>
              <AddrCheckout />
            </Col>

            <Col
              lg={4}
              // lg={{ offset: 1 }}
            >
              {/* {localStorage.getItem("selectedaddr") && <div className="card mt-2"> 
                <h4 className="fontapply">Selected Address</h4>
              <div className="card-body text-start">
                <Row>
                  <Col xs={10}>
                    <h6 className="card-title">{selectedaddr.address}</h6>
                    <p className="card-text">
                      {selectedaddr.city} {selectedaddr.pincode}
                      <br />
                      {selectedaddr.state}
                      <br />
                      {selectedaddr.country}
                    </p>
                    
                  </Col>
                 
                </Row>
              </div>
            </div>} */}

              <div className="card pb-2 pt-2 formadjustcartright mt-2">
                {/* <div className="card-header">Profile</div> */}
                <div className="card-body ">
                  <h3 className="card-title mt-1 ">
                    <h1 className="fontapply text-start">Review Order</h1>
                  </h3>
                  <br />
                  <p className="card-text text-start">
                    SubTotal : ₹ {subtotal}
                  </p>
                  <hr />
                  <p className="card-text text-start">GST(5%) : ₹ {gst} </p>
                  <hr />
                  <p className="card-text text-start">
                    {" "}
                    <b>Order Total : ₹ {total} </b>
                  </p>

                  {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}

                  <div className="d-grid gap-2 mt-5">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={displayRazorpay}
                    >
                      Place Order ₹{total}
                    </Button>
                    {/* <button className="App-link" onClick={displayRazorpay}>
                      Place Order ₹500
                    </button> */}
                    {/* <GooglePayButton
                      environment="TEST"
                      buttonColor={buttonColor}
                      buttonType={buttonType}
                      buttonSizeMode={buttonSizeMode}
                      paymentRequest={paymentRequest}
                      onLoadPaymentData={(paymentRequest) => {
                        console.log("load payment data", paymentRequest);
                      }}
                      style={{ width: buttonWidth, height: buttonHeight }}
                    /> */}
                    {/* <Button
                      variant="primary"
                      size="lg"
                      onClick={() => placeOrder()}
                    >
                      Place Order
                    </Button> */}
                  </div>
                  <br />
                </div>
                {/* <div className="card-footer text-muted">2 days ago</div> */}
              </div>
            </Col>
          </Row>
        </Container>
        <br />
      </div>
    </div>
  );
}

export default Checkout;
