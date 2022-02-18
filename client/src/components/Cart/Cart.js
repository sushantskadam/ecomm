import React, { useEffect, useState } from "react";
import { Table, Container, Button, Row, Col } from "react-bootstrap";
import { addCart } from "../../config/Myservice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./Cart.css";
import { encryptStorage } from "../../config/EncryptStorage";
function Cart() {
  const [cartitems, setCartitems] = useState([]);
  const [subtotal, setsubtotal] = useState();
  const [gst, setgst] = useState();
  const [total, settotal] = useState();
  const [email, setemail] = useState("");
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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    if ((localStorage.getItem("user"))) {
      const user = (encryptStorage.getItem("user"));
      const email = user.email;
      setemail(email);
    }
    callfunction();
  }, []);

  const callfunction = () => {
    let array = JSON.parse(localStorage.getItem("cart"));
    setCartitems(array);

    totalcalc();

    if (array) {
      const count = array
        .map((item) => Number(item.quantity))
        .reduce((prev, curr) => prev + curr, 0);
      // console.log("count"+count)
      dispatch({ type: "count", payload: count });
      // console.log(count);
    } else {
      dispatch({ type: "count", payload: 0 });
    }

    let cart = JSON.parse(localStorage.getItem("cart"));

    const user = (encryptStorage.getItem("user"));
    if (user) {
      let email = user.email;
      addCart({ cart, email });
    }
  };

  const totalcalc = () => {
    let subtotal = 0;
    let array = JSON.parse(localStorage.getItem("cart"));
    if (array) {
      array.forEach((data) => {
        subtotal = subtotal + data.quantity * data.product_cost;
      });
    }

    setsubtotal(subtotal);
    let gstcalc = (5 / 100) * subtotal;

    setgst(Math.round(gstcalc));
    settotal(subtotal + Math.round(gstcalc));
  };
  const delCartitem = (index) => {
    // console.log(id);
    let array = JSON.parse(localStorage.getItem("cart"));
    let arr = array;
    arr.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(arr));
    callfunction();
  };
  const quantHandler = (e, cart, i) => {
    let uparray = JSON.parse(localStorage.getItem("cart"));
    // let cart=uparray
    uparray[i].quantity = e.target.value;
    console.log(uparray);
    // setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(uparray));
    let arr = JSON.parse(localStorage.getItem("cart"));
    setCartitems(arr);
    // let obj = cart;
    // obj.quantity = e.target.value;
    // uparray[i] = obj;
    // localStorage.setItem("cart", JSON.stringify(uparray));
    callfunction();

    // if (quantity < 1) {
    //   alert("You Cannot Enter Quantity less than 1");
    //   document.getElementById("quantity").value = 1;
    // } else {
    //   updCart(id, { quantity }).then((res) => {
    //     if (res.data.err === 0) {
    //       console.log("quantity changed");
    //     }
    //   });
    // }
  };

  const buyHandler = () => {
    if ((encryptStorage.getItem("user"))) {
      if (JSON.parse(localStorage.getItem("cart")).length>0) {
        let order = {
          cartitems: cartitems,
          subtotal: subtotal,
          gst: gst,
          total: total,
          email: email,
        };
        localStorage.setItem("order", JSON.stringify(order));
        callfunction();

        navigate("/checkout");
      } else {
        // alert("Nothing in Cart Please add Products in Cart");
        setAlertmsg("Nothing in Cart Please add Products")
        setOpen(true);
  
        setTimeout(()=> {
          navigate("/products");
        }, 2000);
      }
    } else {
      // alert("Login is Required");
      setAlertmsg("Login is Required")
      setOpen(true);

      setTimeout(()=> {
        navigate("/login");
      }, 2000);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  return (
    <div>
      {loading ? (
        <HashLoader
          color={"#D73636"}
          loading={loading}
          css={override}
          size={150}
        />
      ) : (
        <div className="mt-2">
          <Container>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}>
              <Alert
                onClose={handleClose}
                severity="error"
                sx={{ width: "100%" }}
              >
                {alertmsg}
              </Alert>
            </Snackbar>
            <h2 className="text-start fontapply">Cart</h2>
            <hr />
            <Row className="mt-3">
              <Col lg={8}>
                <div className="text-center formadjustcart p-2 mt-2 ">
                  <Container>
                    <Table
                      hover
                      style={{ borderCollapse: "collapse", border: "white" }}
                    >
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody className="cartfontapply">
                        {cartitems &&
                          cartitems.map((cart, i) => (
                            <tr key={i}>
                              <td>
                                <Row>
                                  <Col xl={2}>
                                    <img
                                      // src={cart.product_subImages[0]}
                                      src= {`http://localhost:9999/${cart.product_subImages[0]}`}

                                      width="70"
                                      height="70"
                                    ></img>
                                  </Col>
                                  &nbsp; &nbsp; &nbsp;
                                  <Col xl={9} className="text-start">
                                    {cart.product_name}
                                    <br />
                                    <span
                                      className="text-muted"
                                      style={{ size: "20px" }}
                                    >
                                      {" "}
                                      Status :
                                      {cart.quantity < 11 ? (
                                        <span className="text-success text-start">
                                          In Stock
                                        </span>
                                      ) : (
                                        <span className="text-danger">
                                          Out Of Stock
                                        </span>
                                      )}
                                    </span>
                                  </Col>
                                </Row>
                              </td>

                              <td style={{ width: "60px" }}>
                                <div>
                                  {/* <Button className="btn btn-danger quantbttn" size="sm">
                                         <i className="fa fa-plus" aria-hidden="true"></i>
                                       </Button> */}

                                  <input
                                    type="number"
                                    className="form-control quantityadjust"
                                    id="quantity"
                                    defaultValue={cart.quantity}
                                    min="1"
                                    max="10"
                                    onChange={(e) => quantHandler(e, cart, i)}
                                    // disabled
                                  />
                                  {/* <a href="#">-</a><a href="#" className="border">1</a><a href="#">+</a> */}

                                  {/* <Button className="btn btn-danger quantbttn" size="sm">
                                         <i className="fa fa-minus" aria-hidden="true"></i>
                                       </Button> */}
                                </div>
                              </td>
                              <td style={{ width: "80px" }}>
                                {" "}
                                ₹{cart.product_cost}
                              </td>
                              <td style={{ width: "80px" }}>
                                {" "}
                                ₹{cart.product_cost * cart.quantity}{" "}
                              </td>
                              <td>
                                <Button
                                  className="btn btn-danger"
                                  size="sm"
                                  onClick={() => delCartitem(i)}
                                >
                                  <i
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                  ></i>
                                </Button>
                              </td>
                            </tr>
                          ))}

                        {/* <tr>
                            
                            <td>
                              <Row>
                                <Col>
                                  <img src="" width="70" height="70"></img>
                                </Col>
                                <Col className="text-start">sofa</Col>
                              </Row>
                            </td>
    
                           
                            <td>
                              <Row>
                                <Col>
                                  <Button className="btn btn-danger" size="sm">
                                    <i className="fa fa-plus" aria-hidden="true"></i>
                                  </Button>
                                </Col>
                                <Col>
                                  <input
                                    type="number"
                                    className="form-control quantityadjust"
                                    defaultValue="2"
                                    size="sm"
                                  />
                                </Col>
                                <Col>
                                  <Button className="btn btn-danger" size="sm">
                                    <i className="fa fa-minus" aria-hidden="true"></i>
                                  </Button>
                                </Col>
                              </Row>
                            </td>
                            <td> ₹2000</td>
                            <td> ₹4000</td>
                            <td>
                              <button className="btn btn-danger">
                                <i className="fa fa-times" aria-hidden="true"></i>
                              </button>
                            </td>
                          </tr> */}
                      </tbody>
                    </Table>
                  </Container>
                </div>
              </Col>

              <Col
                lg={4}
                // lg={{ offset: 1 }}
              >
                <div className="card pb-2 pt-2 formadjustcartright mt-2">
                  {/* <div className="card-header">Profile</div> */}
                  <div className="card-body ">
                    <h1 className="fontapply text-start card-title mt-1 ">
                      Review Order
                    </h1>

                    <br />
                    <p className="card-text text-start">
                      SubTotal : ₹ {subtotal}
                    </p>
                    <hr />
                    <p className="card-text text-start">GST(5%) : ₹ {gst} </p>
                    <hr />
                    <p className="card-text text-start">
                      {" "}
                      <b>Order Total : ₹ {subtotal + gst} </b>
                    </p>

                    {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}

                    <div className="d-grid gap-2 mt-5">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => buyHandler()}
                      >
                        Proceed to Buy
                      </Button>
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
      )}
    </div>
  );
}

export default Cart;
