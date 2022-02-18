import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct, addCart, getCartd } from "../../config/Myservice";
import { Tab, Tabs, Row, Col, Container, Alert } from "react-bootstrap";

import StarRatings from "react-star-ratings";
import Magnifier from "react-magnifier";
import { useDispatch, useSelector } from "react-redux";
import HashLoader from "react-spinners/HashLoader";

import {
  PinterestShareButton,
  PinterestIcon,
  OKShareCount,
  WhatsappShareButton,
  WhatsappIcon,
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  TelegramShareButton,
  TelegramIcon,
} from "react-share";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./ProdDetails.css";
import { encryptStorage } from "../../config/EncryptStorage";
function ProdDetails() {
  let { id } = useParams();
  // const [id, setId] = useState('')
  const [product, setProduct] = useState();
  const [selectedImg, setSelectedImg] = useState("");
  const [images, setImages] = useState([]);
  const [userdata, setUserdata] = useState();
  const [cartitems, setCartitems] = useState([]);

  const [alertmsg, setAlertmsg] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
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
    // countcalc();
    dispatch({ type: "countcalc" });

    const user = (encryptStorage.getItem("user"));
    setUserdata(user);

    getProduct(id).then((res) => {
      // console.log(res.data.data);
      setProduct(res.data.data);
      setSelectedImg(res.data.data.product_subImages[0]);
      setImages(res.data.data.product_subImages);
    });
    if ((encryptStorage.getItem("user"))) {
      getCartd(user.email).then((res) => {
        setCartitems(res.data.data);
      });
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  useEffect(() => {
    
    if ((encryptStorage.getItem("user"))) {
      const user = (encryptStorage.getItem("user"));
      getCartd(user.email).then((res) => {
        setCartitems(res.data.data);
      });
    }
  }, [cartitems]);
  // const countcalc = () => {
  //   let array = JSON.parse(localStorage.getItem("cart"));
  //   if (array) {
  //     const count = array
  //       .map((item) => Number(item.quantity))
  //       .reduce((prev, curr) => prev + curr, 0);
  //     // console.log("count"+count)
  //     dispatch({ type: "count", payload: count });
  //     // console.log(count);
  //   }
  // };
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
      if (found === true) {
        // alert("Product Quantity Increased");
        setAlertmsg("Product Quantity Increased");
        setOpen(true)
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

        // alert("Product Added To Cart");
        // setAlertmsg("Product Added To Cart");
        setAlertmsg("Product Added To Cart");
        setOpen(true);
      }
    } else {
      let array = [];

      array.push(data);

      localStorage.setItem("cart", JSON.stringify(array));

      // alert("Product added to Cart");
      setAlertmsg("Product Added To Cart");
    }

    // countcalc();
    dispatch({ type: "countcalc" });

  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    
    setOpen(false);
  };


  if (product) {
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
          <>
            <Container>
              {/* {alertmsg && (
                <Alert variant="info mt-2 fontapply fs-5">{alertmsg}</Alert>
              )} */}
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
              <Row className="containerdetails fontapplydetails text-start mt-3">
                <Col className="left-column" lg={5}>
                  <div>
                    <Magnifier
                      className="imgmain"
                      data-image="black"
                      width={400}
                      height={400}
                      // src={selectedImg}
                      src={`http://localhost:9999/${selectedImg}`}

                      alt=""
                    />
                    {/* <img data-image="blue" src="images/blue.png" alt=""/>
   <img data-image="red" className="active" src="images/red.png" alt=""/> */}
   
                  </div>
                  {/* <div>
                    <button
                      className="btn "
                      onClick={() =>
                        setSelectedImg(product.product_subImages[0])
                      }
                    >
                      {" "}
                      <img className="mt-2 smallimg" src={images[0]} alt="" />
                    </button>
                    &nbsp;
                    <button
                      className="btn"
                      onClick={() =>
                        setSelectedImg(product.product_subImages[1])
                      }
                    >
                      {" "}
                      <img className="mt-2 smallimg" src={images[1]} alt="" />
                    </button>
                    &nbsp;
                    <button
                      className="btn"
                      onClick={() =>
                        setSelectedImg(product.product_subImages[2])
                      }
                    >
                      {" "}
                      <img
                        className="mt-2 smallimg"
                        src={product.product_subImages[2]}
                        alt=""
                      />
                    </button>
                  </div> */}
                </Col>

                <Col className="right-column" lg={6} lg={{ offset: 1 }}>
                  <div className="product-description">
                    <span>
                      {/* {product.category_id.category_name} */}
                      {/* Cat Name */}
                    </span>
                    <br />
                      
                    <h1>
                      {product.product_name}
                      {/* Name */}
                    </h1>
                    <StarRatings
                      rating={product.product_rating}
                      starRatedColor="#FFDF00"
                      // changeRating={this.changeRating}
                      numberOfStars={5}
                      name="rating"
                      starDimension="26px"
                      starSpacing="2px"
                    />
                    <br />
                    <button
                      className="cart-btn-rate"
                      // onClick={() => addtoCart(product)}
                    >
                      Rate Product
                    </button>
                    <br />
                    {/* <p>{product.product_desc}</p> */}
                  </div>
                  Share{" "}
                  <i className="fa fa-share-alt mb-2" aria-hidden="true"></i>
                  <br />
                  <FacebookShareButton
                    url="https://www.neosofttech.com/"
                    quote={"Hello Everyone Check it out"}
                    hashtag="#react"
                  >
                    <FacebookIcon size={50} round={true} />{" "}
                  </FacebookShareButton>{" "}
                  &nbsp;
                  <EmailShareButton
                    url="https://www.neosofttech.com/"
                    quote={"Hello Everyone Check it out"}
                    hashtag="#react"
                  >
                    <EmailIcon size={50} round={true} />
                  </EmailShareButton>{" "}
                  &nbsp;
                  <TelegramShareButton
                    url="https://www.neosofttech.com/"
                    quote={"Hello Everyone Check it out"}
                    hashtag="#react"
                  >
                    <TelegramIcon size={50} round={true} />
                  </TelegramShareButton>
                  &nbsp;
                  <PinterestShareButton
                    url="https://www.neosofttech.com/"
                    quote={"Hello Everyone Check it out"}
                    hashtag="#react"
                  >
                    <PinterestIcon size={50} round={true} />
                  </PinterestShareButton>{" "}
                  &nbsp;
                  <WhatsappShareButton
                    url="https://www.neosofttech.com/"
                    quote={"Hello Everyone Check it out"}
                    hashtag="#react"
                  >
                    <WhatsappIcon size={50} round={true} />
                  </WhatsappShareButton>
                  &nbsp;
                  <TwitterShareButton
                    url="https://www.neosofttech.com/"
                    quote={"Hello Everyone Check it out"}
                    hashtag="#react"
                  >
                    <TwitterIcon size={50} round={true} />
                  </TwitterShareButton>
                  &nbsp;
                  <div className="product-configuration">
                    {/* <div className="product-color">
               <span>Color</span>

               <div className="color-choose">
                 <div>
                   <input
                     data-image="red"
                     type="radio"
                     id="red"
                     name="color"
                     value="red"
                     checked
                   />
                   <label for="red">
                     <span></span>
                   </label>
                 </div>
                 <div>
                   <input
                     data-image="blue"
                     type="radio"
                     id="blue"
                     name="color"
                     value="blue"
                   />
                   <label for="blue">
                     <span></span>
                   </label>
                 </div>
                 <div>
                   <input
                     data-image="black"
                     type="radio"
                     id="black"
                     name="color"
                     value="black"
                   />
                   <label for="black">
                     <span></span>
                   </label>
                 </div>
               </div>
             </div> */}

                    <br />

                    <div className="product-price mt-4">
                      <span>{product.product_cost} ₹</span>
                      <button
                        className="cart-btn"
                        onClick={() => addtoCart(product)}
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </Col>
              </Row>
              <div className="container mt-4 ">
                <Tabs
                  defaultActiveKey="profile"
                  id="uncontrolled-tab-example"
                  className="mb-3 tabadjust "
                >
                  <Tab
                    eventKey="home"
                    title="Description"
                    className="text-secondary "
                  >
                    {product.product_desc}
                  </Tab>
                  <Tab
                    eventKey="profile"
                    title="Features"
                    className="text-start pl-4 text-secondary"
                  >
                    Brand: {product.product_producer} <br />
                    Dimension : {product.product_dimension}
                    <br />
                    Material: {product.product_material}
                  </Tab>
                  {/* <Tab eventKey="contact" title="Contact" disabled>
   asfjasjfsajfsajfa
 </Tab> */}
                </Tabs>
              </div>
            </Container>
          </>
        )}
      </div>
    );
  } else {
    return <div>Product Empty</div>;
  }
}

export default ProdDetails;
