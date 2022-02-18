import React, { useState, useEffect } from "react";
import { Button, Row, Container, Card, Alert } from "react-bootstrap";
import "./Products.css";
import {
  addCart,
  getCategory,
  getColors,
  getProducts,tokenAuth
} from "../../config/Myservice";
import ReactPaginate from "react-paginate";
// import ReactStars from "react-rating-stars-component";
import StarRatings from "react-star-ratings";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import HashLoader from "react-spinners/HashLoader";
import Stack from "@mui/material/Stack";
// import Button from '@mui/material/Button';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { encryptStorage } from "../../config/EncryptStorage";

function Products({ search }) {
  // console.log(search);
  const [productdata, setProductData] = useState([]);
  const [prodata, setProdata] = useState([]);
  const [category, setCategory] = useState([]);
  const [colors, setColors] = useState([]);
  const [categoryselected, setCategoryselected] = useState("");
  const [colorselected, setColorselected] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [alertmsg, setAlertmsg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const override = `
  display: block;
  margin: 230px auto;
  border-color: red;
`;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const userPerPage = 6;
  const pagesVisited = pageNumber * userPerPage;

  const displayprod = prodata
    .filter((val) => {
      if (search === "") {
        return val;
      } else if (
        val.product_name.toLowerCase().includes(search.toLocaleLowerCase())
      ) {
        return val;
      }
    })
    .slice(pagesVisited, pagesVisited + userPerPage)

    .map((prod, i) => (
      <Card
        key={i}
        style={{ width: "18rem", margin: "13px" }}
        className="bg-light bg-gradient card-hghlght cardcss"
      >
        <span onClick={() => cardHandler(prod._id)}>
          <Card.Img
            variant="top"
            // src={prod.product_subImages[0]}
            src= {`http://localhost:9999/${prod.product_subImages[0]}`}
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
            className="mb-2 bttn"
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
    ));

  const pageCount = Math.ceil(prodata.length / userPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
   const fetchData=async()=> {
     try{
      await getProducts().then((res, err) => {
        setProductData(res.data.data);
        setProdata(res.data.data.slice(0, 30));
        console.log(res.data.data);
      });
      await getCategory().then((res, err) => {
        if (err) throw err;
        else {
          setCategory(res.data.data);
          // console.log(category);
        }
      });
      await getColors().then((res, err) => {
        if (err) throw err;
        else {
          setColors(res.data.data);
          // console.log(res.data.data);
        }
      });
     }catch(e){
      console.log(e)

     }
  }
  useEffect(() => {
     tokenAuth().then((res)=>{
      console.log(res.data)
      if(res.data.err===2){
        localStorage.removeItem("login");
        encryptStorage.removeItem("user");
        localStorage.removeItem("_token");
        dispatch({ type: "countcalc" });
        // navigate("/")
        // localStorage.removeItem("cart");
        // dispatch({ type: "count", payload: 0 });

      }
    })
    setLoading(true);
    fetchData()
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    // setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    // }, 1000);
    if ((encryptStorage.getItem("user"))) {
      // countcalc();
      dispatch({ type: "countcalc" });

    }

    let cart = JSON.parse(localStorage.getItem("cart"));
    const user = (encryptStorage.getItem("user"));
    // console.log(user.email)
    if (user) {
      
      let email = user.email;
      addCart({ cart, email });
    }
  }, []);

  // const countcalc = () => {
  //   let array = JSON.parse(localStorage.getItem("cart"));
  //   if (array) {
  //     const count = array
  //       .map((item) => Number(item.quantity))
  //       .reduce((prev, curr) => prev + curr, 0);
  //     // console.log("count"+count)
  //     dispatch({ type: "count", payload: count });
  //     // console.log(count)
  //   } else {
  //     dispatch({ type: "count", payload: 0 });
  //   }
  // };
  const categoryHandler = (catname) => {
    setCategoryselected(catname);
    if (colorselected === "") {
      const updatedItems = productdata.filter((curElem) => {
        return curElem.category_id.category_name === catname;
      });
      setProdata(updatedItems);
    } else {
      const updatedItems = productdata.filter((curElem) => {
        return (
          curElem.category_id.category_name === catname &&
          curElem.color_id.color_name === colorselected
        );
      });
      setProdata(updatedItems);
    }
  };
  const colorHandler = (colname) => {
    setColorselected(colname);
    if (categoryselected === "") {
      const updatedItemsc = productdata.filter((curElem) => {
        return curElem.color_id.color_name === colname;
      });
      setProdata(updatedItemsc);
    } else {
      const updatedItemsc = productdata.filter((curElem) => {
        return (
          curElem.color_id.color_name === colname &&
          curElem.category_id.category_name === categoryselected
        );
      });
      setProdata(updatedItemsc);
    }
  };
  const allproductHandler = () => {
    setCategoryselected("");
    setColorselected("");
    setProdata(productdata.slice(0, 30));
  };

  const cardHandler = (id) => {
    // alert("clicked on cart");
    navigate(`/products/${id}`);
  };
  const sortbyStar = async () => {
    console.log("inside starsort");
    setProdata(productdata);
    const pdata = await prodata.sort(
      (a, b) => parseFloat(b.product_rating) - parseFloat(a.product_rating)
    );
    setProdata(pdata);
  };
  const sortbyPriceup = async () => {
    console.log("inside sortbyPriceup");
    setProdata(productdata);

    const pdata = await prodata.sort(
      (a, b) => parseFloat(a.product_cost) - parseFloat(b.product_cost)
    );
    setProdata(pdata);
  };
  const sortbyPricedown = async () => {
    console.log("inside sortbyPricedown");

    setProdata(productdata);

    const pdata = await prodata.sort(
      (a, b) => parseFloat(b.product_cost) - parseFloat(a.product_cost)
    );
    setProdata(pdata);
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
      if (found === true) {
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

    // countcalc();
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
                sx={{ width: "100%" }}
              >
                {alertmsg}
              </Alert>
            </Snackbar>
          </Container>

          {/* <div className="sidebar floatleft">
            <a>
              <div className="dropdown">
                <button
                  className="dropbtn"
                  type="button"
                  onClick={allproductHandler}
                >
                  All Products
                </button>
              </div>
            </a>
            <div>
              <div className="dropdown">
                <button className="dropbtn">
                  <i className="fa fa-caret-down"></i> Category
                </button>
                <div className="dropdown-content">
                  {category.map((cat, i) => (
                    <a
                      key={i}
                      onClick={() => categoryHandler(cat.category_name)}
                    >
                      {" "}
                      {cat.category_name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <br />
            <div>
              <div className="dropdown">
                <button className="dropbtn">
                  <i className="fa fa-caret-down"></i> Color
                </button>
                <div className="dropdown-content">
                  {colors.map((col, i) => (
                    <a key={i} onClick={() => colorHandler(col.color_name)}>
                      {" "}
                      {col.color_name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div> */}

          <div className="content">
            <Container className="mt-4">
              <div className="text-end fontapply">
                Sort by:{"  "} &nbsp;
                <button className="btn btn-light sortbttn" onClick={sortbyStar}>
                  <i className="fa fa-star"></i>
                </button>
                &nbsp;
                <button
                  className="btn btn-light sortbttn"
                  onClick={sortbyPriceup}
                >
                  <i className="fa fa-rupee " style={{ fontSize: "10px" }}></i>
                  <i className="fa fa-arrow-up"></i>
                </button>
                &nbsp;
                <button
                  className="btn btn-light sortbttn"
                  onClick={sortbyPricedown}
                >
                  <i className="fa fa-rupee " style={{ fontSize: "10px" }}></i>
                  <i className="fa fa-arrow-down"></i>
                </button>
              </div>

              <Row xs={6} md={4} className="justify-content-center fontapply">
                {displayprod}
              </Row>
              <ReactPaginate
                previousLabel={"Prev"}
                nextLabel={"Next"}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
              ></ReactPaginate>
            </Container>
          </div>
        </>
      )}{" "}
    </div>
  );
}

export default Products;
