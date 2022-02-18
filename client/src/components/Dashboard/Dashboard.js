import React, { useState, useEffect } from "react";
import { Carousel, Container, Card, Button, Row, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getCartd, delCart, updCart } from "../../config/Myservice";
import {
  addCart,
  getProducts,
  getCategory,
  tokenAuth,
} from "../../config/Myservice";
import StarRatings from "react-star-ratings";
import { useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./Dashboard.css";
import { encryptStorage } from "../../config/EncryptStorage";

function Dashboard() {
  const [cartitems, setCartitems] = useState([]);
  const dispatch = useDispatch();
  const [productdata, setProductData] = useState([]);
  const [prodata, setProdata] = useState([]);
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertmsg, setAlertmsg] = useState(false);
  const [open, setOpen] = useState(false);
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const override = `
  display: block;
  margin: 230px auto;
  border-color: red;
`;
  useEffect(() => {
    tokenAuth().then((res) => {
      console.log(res.data);
      if (res.data.err === 2) {
        localStorage.removeItem("login");
        encryptStorage.removeItem("user");
        localStorage.removeItem("_token");
        dispatch({ type: "countcalc" });
        navigate("/");

        // localStorage.removeItem("cart");
        // dispatch({ type: "count", payload: 0 });
      }
    });
    // countcalc()
    dispatch({ type: "countcalc" });

    getProducts().then((res, err) => {
      setProductData(res.data.data);
      // setProdata(res.data.data.slice(0, 30));
      // console.log(res.data.data);
      const pdata = res.data.data.sort(
        (a, b) => parseFloat(b.product_rating) - parseFloat(a.product_rating)
      );
      setProdata(pdata.slice(0, 4));
      // console.log(res.data.data);
      // console.log(pdata.slice(0,6))
    });
    getCategory().then((res, err) => {
      if (err) throw err;
      else {
        setCategory(res.data.data);
        // console.log(res.data.data);
      }
    });

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  // useEffect(() => {
  //   if (JSON.parse(localStorage.getItem("user"))) {
  //     const user = JSON.parse(localStorage.getItem("user"));
  //     const email = user.email;
  //    countcalc()
  //   }
  // }, [cartitems]);
  // const countcalc=()=>{
  // let array = JSON.parse(localStorage.getItem("cart"));
  // if (array) {
  //   const count = array
  //     .map((item) => Number(item.quantity))
  //     .reduce((prev, curr) => prev + curr, 0);
  //   // console.log("count"+count)
  //   dispatch({ type: "count", payload: count });
  //   // console.log(count)
  // } else {
  //   dispatch({ type: "count", payload: 0 });
  // }

  // }
  const cardHandler = (id) => {
    // alert("clicked on cart");
    navigate(`/products/${id}`);
  };

  const addtoCart = (prod) => {
    // if(JSON.parse(localStorage.getItem("user"))){
    // const email = userdata.email;
    console.log(prod);
    let data = {
      id: prod._id,
      product_name: prod.product_name,
      product_desc: prod.product_desc,
      product_cost: prod.product_cost,
      product_dimension: prod.product_dimension,
      product_material: prod.product_material,
      product_producer: prod.product_producer,
      product_rating: prod.product_rating,
      product_subImages: prod.product_subImages,
      // email: email,
      quantity: 1,
    };

    if (localStorage.getItem("cart")) {
      let array = JSON.parse(localStorage.getItem("cart"));

      let found = array.some((cart) => cart.id === prod._id);
      if (found == true) {
        // alert("Product Quantity Increased");
        setAlertmsg("Product Quantity Increased");
        setOpen(true);
        const index = array.findIndex((x) => x.id === prod._id);
        let newarray = array;
        let updata = {
          id: prod._id,
          product_name: prod.product_name,
          product_desc: prod.product_desc,
          product_cost: prod.product_cost,
          product_dimension: prod.product_dimension,
          product_material: prod.product_material,
          product_producer: prod.product_producer,
          product_rating: prod.product_rating,
          product_subImages: prod.product_subImages,
          // email: email,
          quantity: array[index].quantity + 1,
        };

        newarray[index] = updata;
        localStorage.setItem("cart", JSON.stringify(newarray));
      } else {
        array.push(data);
        localStorage.setItem("cart", JSON.stringify(array));

        // alert("Product added to Cart");
        setAlertmsg("Product added to Cart");
        setOpen(true);
      }
    } else {
      let array = [];

      array.push(data);

      localStorage.setItem("cart", JSON.stringify(array));
      // alert("Product added to Cart");
      setAlertmsg("Product added to Cart");
      setOpen(true);
    }

    // countcalc()
    dispatch({ type: "countcalc" });
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
        <Container fluid={true}>
          {/* <Carousel>
            {category.map((cat, i) => (
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={cat.category_image}
                  // alt="First slide"
                  // height="550"
                />
                
              </Carousel.Item>
            ))}

            
          </Carousel> */}

          <Carousel fade>
            {category.map((cat, i) => (
              <Carousel.Item interval={1000} key={i}>
                <img
                  className="d-block w-100 carouselcss"
                  src={cat.category_image}
                  alt="First slide"
                />
              </Carousel.Item>
            ))}
          </Carousel>
          <Snackbar
            open={open}
            autoHideDuration={1000}
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
          <h4 className="mt-4 fontapply">Popular Products</h4>
          <a
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/products")}
          >
            View All
          </a>
          {/* <Container>
            {alertmsg && (
              <Alert variant="info mt-2 fontapply fs-5">{alertmsg}</Alert>
            )}
          </Container> */}

          <Row xs={6} md={4} className="justify-content-center fontapply">
            {prodata.map((prod, i) => (
              <Card
                key={i}
                style={{ width: "18rem", margin: "13px" }}
                className="bg-light bg-gradient card-hghlght cardcss"
              >
                <span onClick={() => cardHandler(prod._id)}>
                  <Card.Img
                    variant="top"
                    // src={prod.product_subImages[0]}
                    src={`http://localhost:9999/${prod.product_subImages[0]}`}
                    className="cardimgprod"
                    width="200"
                    height="250"
                  />
                </span>
                <Card.Body className="mt-auto">
                  <Card.Title className="mt-1">{prod.product_name}</Card.Title>
                  {/* <Card.Text> {prod.quantity}</Card.Text> */}
                  <Card.Text className="mt-4">
                    <b>₹ {prod.product_cost}</b>
                  </Card.Text>

                  <Button
                    variant="danger"
                    // onClick={() => addCart(prod.id, prod)}
                    className="mb-2"
                    onClick={() => addtoCart(prod)}
                  >
                    Add to Cart
                  </Button>
                  <StarRatings
                    rating={prod.product_rating}
                    starRatedColor="#FFDF00"
                    // changeRating={this.changeRating}
                    numberOfStars={5}
                    name="rating"
                    starDimension="26px"
                    starSpacing="2px"
                  />
                </Card.Body>
              </Card>
            ))}
          </Row>
        </Container>
      )}
    </div>
  );
}

export default Dashboard;
