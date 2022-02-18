import React, { useState, useEffect } from "react";
import { delProd, getProducts, updateProd } from "../../config/Myservice";
import {
  Button,
  Row,
  Col,
  Form,
  Card,
  Table,
  FormControl,
} from "react-bootstrap";
import "./AddProduct.css";
import { addProd,tokenAuth } from "../../config/Myservice";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { encryptStorage } from "../../config/EncryptStorage";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";


const regForName = /^[a-zA-Z ]{2,100}$/;

function AddProduct() {
  const [errors, setErrors] = useState({});
  const [product, setProduct] = useState({
    _id: "",
    product_name: "",
    product_desc: "",
    product_producer: "",
    product_cost: "",
    product_dimension: "",
    product_material: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [prodata, setProdata] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [alertmsg, setAlertmsg] = useState(false);
  const [update, setUpdate] = useState(false);
  const [userl, setuser] = useState({})
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
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
    const user=encryptStorage.getItem('user')
    setuser(user)
    if(user){
      if(user.role!=="admin"){
        navigate("/")
      }else{
        getProducts().then((res, err) => {
          // setProductData(res.data.data);
          setProdata(res.data.data.slice(0, 30));
          console.log(res.data.data);
        });
      }
    }else{
      navigate("/")
    }
  
    
  }, []);

  const handler = (e) => {
    const { name, value } = e.target;
    // if (convertedContent) {

    setProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    switch (name) {
      case "subject":
        let esubject = regForName.test(value)
          ? ""
          : "Please Enter Subject Name";
        setErrors({ ...errors, subject: esubject });
        console.log(value);
        break;
      case "lname":
        let eqtype = regForName.test(value)
          ? ""
          : "Please Enter Valid Question Type";
        setErrors({ ...errors, qtype: eqtype });
        break;
      case "que":
        let eque = value.length > 5 ? "" : "Please Enter Valid Question";
        setErrors({ ...errors, que: eque });
        break;

      case "marks":
        let emarks = value > 0 ? "" : "Should be > 0";
        setErrors({ ...errors, marks: emarks });
        break;
      default:
    }
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen2(false);
    setOpen(false);
  };
  const addHandler = () => {
    let pimg = document.querySelector('input[type="file"]').files[0];

    if (
      product.product_name !== "" &&
      product.product_desc !== "" &&
      product.product_producer !== "" &&
      product.product_cost !== "" &&
      product.product_dimension !== "" &&
      product.product_material !== "" &&
      pimg
    ) {
      console.log(product);
      let formData = new FormData(); //formdata object

      // var pimg = document.querySelector('input[type="file"]').files[0];
      // var pimg2 = document.querySelector('input[type="file"]').files[1];
      // var pimg3 = document.querySelector('input[type="file"]').files[2];

      // console.log(pimg);
      formData.append("myfile", pimg);
      formData.append("product_name", product.product_name);
      formData.append("product_desc", product.product_desc);
      formData.append("product_cost", product.product_cost);
      formData.append("product_producer", product.product_producer);
      formData.append("product_dimension", product.product_dimension);
      formData.append("product_material", product.product_material);

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
      addProd(formData).then((res) => {
        console.log(res.data);
        if (res.data.err === 0) {
          console.log(res.data)

          setProdata(res.data.proddata);
          setAlertmsg("Product Added");
          setOpen(true);
          setProduct({
            _id: "",
            product_name: "",
            product_desc: "",
            product_producer: "",
            product_cost: "",
            product_dimension: "",
            product_material: "",
          });
        }else if(res.data.err === 2) {
            localStorage.removeItem("login");
            encryptStorage.removeItem("user");
            localStorage.removeItem("_token");
            dispatch({ type: "countcalc" });
            navigate("/");
    
            // localStorage.removeItem("cart");
            // dispatch({ type: "count", payload: 0 });
          }
      });
    } else {
      setAlertmsg("Enter Valid Data");
      setOpen2(true);
    }
  };
  const removeHandler = (id) => {
    console.log(id);
    delProd(id).then((res) => {
      setProdata(res.data.proddata);
     if(res.data.err === 2) {
        localStorage.removeItem("login");
        encryptStorage.removeItem("user");
        localStorage.removeItem("_token");
        dispatch({ type: "countcalc" });
        navigate("/");

        // localStorage.removeItem("cart");
        // dispatch({ type: "count", payload: 0 });
      }
      console.log(res.data)
    });
  };
  const editHandler = (prod) => {
    console.log(prod);
    setProduct(prod);
    setUpdate(true);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  const updateHandler = () => {
    let pimg = document.querySelector('input[type="file"]').files[0];

    if (
      product.product_name !== "" &&
      product.product_desc !== "" &&
      product.product_producer !== "" &&
      product.product_cost !== "" &&
      product.product_dimension !== "" &&
      product.product_material !== "" &&
      pimg
    ) {
      console.log(product);
      let formData = new FormData(); //formdata object

      let pimg = document.querySelector('input[type="file"]').files[0];
      // var pimg2 = document.querySelector('input[type="file"]').files[1];
      // var pimg3 = document.querySelector('input[type="file"]').files[2];

      // console.log(pimg);
      formData.append("myfile", pimg);
      formData.append("product_name", product.product_name);
      formData.append("product_desc", product.product_desc);
      formData.append("product_cost", product.product_cost);
      formData.append("product_producer", product.product_producer);
      formData.append("product_dimension", product.product_dimension);
      formData.append("product_material", product.product_material);

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
      updateProd(product._id, formData).then((res) => {
        console.log(res.data)

        if (res.data.err === 0) {
          setAlertmsg("Product Updated Successfully");
          setOpen(true);
          setProdata(res.data.proddata);
          setProduct({
            _id: "",
            product_name: "",
            product_desc: "",
            product_producer: "",
            product_cost: "",
            product_dimension: "",
            product_material: "",
          });
        }else if(res.data.err === 2) {
          localStorage.removeItem("login");
          encryptStorage.removeItem("user");
          localStorage.removeItem("_token");
          dispatch({ type: "countcalc" });
          navigate("/");
  
          // localStorage.removeItem("cart");
          // dispatch({ type: "count", payload: 0 });
        }
      });
    } else {
      setAlertmsg("Enter Valid Data");
      setOpen2(true);
    }
    setUpdate(false)
  };
if(userl.role==="admin"){
  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={1500}
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
        autoHideDuration={1500}
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
      <div className="formadjustadmin mt-2">
        <Form id="myForm">
          <h1 className="fontapply">Add New Product</h1>
          <br />
          <div className="form-group row">
            <label
              for="inputEmail3"
              className="col-sm-3 col-form-label font-weight-bold"
            >
              Product Name
            </label>
            <div className="col-sm-9">
              <Form.Control
                type="text"
                className="form-control"
                id="inputEmail3"
                placeholder="Product Name"
                onChange={handler}
                name="product_name"
                // readOnly={allque.length > 0 ? true : false}
                defaultValue={product.product_name}
                // isValid={question.subject !== "" ? true : false}
                // isInvalid={errors.subject !== "" ? true : false}
              />
              <Form.Control.Feedback type="invalid">
                {/* {errors.subject} */}
              </Form.Control.Feedback>
            </div>
          </div>

          <div className="form-group row">
            <label
              for="inputPassword3"
              className="col-sm-3 col-form-label font-weight-bold"
            >
              Product Description
            </label>
            <div className="col-sm-9">
              <Form.Control
                as="textarea"
                rows={2}
                type="text"
                className="form-control"
                placeholder="Product Description"
                onChange={handler}
                name="product_desc"
                defaultValue={product.product_desc}
                // isValid={question.que !== "" ? true : false}
                // isInvalid={errors.que !== "" ? true : false}
              />
              <Form.Control.Feedback type="invalid">
                {/* {errors.que} */}
              </Form.Control.Feedback>
            </div>
          </div>

          <div className="form-group row">
            <label
              for="inputPassword3"
              className="col-sm-3 col-form-label font-weight-bold"
            >
              Product Producer
            </label>
            <div className="col-sm-9">
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Product Producer"
                onChange={handler}
                name="product_producer"
                defaultValue={product.product_producer}
                // isValid={question.que !== "" ? true : false}
                // isInvalid={errors.que !== "" ? true : false}
              />
              <Form.Control.Feedback type="invalid">
                {/* {errors.que} */}
              </Form.Control.Feedback>
            </div>
          </div>

          <div className="form-group row">
            <label
              for="inputPassword3"
              className="col-sm-3 col-form-label font-weight-bold"
            >
              Product Cost
            </label>
            <div className="col-sm-9">
              <Form.Control
                type="number"
                className="form-control"
                placeholder="Product Cost"
                onChange={handler}
                name="product_cost"
                defaultValue={product.product_cost}
                // isValid={question.que !== "" ? true : false}
                // isInvalid={errors.que !== "" ? true : false}
              />
              <Form.Control.Feedback type="invalid">
                {/* {errors.que} */}
              </Form.Control.Feedback>
            </div>
          </div>
          <div className="form-group row">
            <label
              for="inputPassword3"
              className="col-sm-3 col-form-label font-weight-bold"
            >
              Product Dimension
            </label>
            <div className="col-sm-9">
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Product Dimension"
                onChange={handler}
                name="product_dimension"
                defaultValue={product.product_dimension}
                // isValid={question.que !== "" ? true : false}
                // isInvalid={errors.que !== "" ? true : false}
              />
              <Form.Control.Feedback type="invalid">
                {/* {errors.que} */}
              </Form.Control.Feedback>
            </div>
          </div>
          <div className="form-group row">
            <label
              for="inputPassword3"
              className="col-sm-3 col-form-label font-weight-bold"
            >
              Product Material
            </label>
            <div className="col-sm-9">
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Product Material"
                onChange={handler}
                name="product_material"
                defaultValue={product.product_material}
                // isValid={question.que !== "" ? true : false}
                // isInvalid={errors.que !== "" ? true : false}
              />
              <Form.Control.Feedback type="invalid">
                {/* {errors.que} */}
              </Form.Control.Feedback>
            </div>
          </div>
          <div className="form-group row">
            <label
              for="inputPassword3"
              className="col-sm-3 col-form-label font-weight-bold"
            >
              Image
            </label>
            <div className="col-sm-9">
              <div class="mb-3">
                <input
                  class="form-control"
                  type="file"
                  id="formFile"
                  //  defaultValue={product.product_subImages[0]}
                />
              </div>
            </div>
          </div>
          {/* <div className="form-group row">
            <label
              for="inputPassword3"
              className="col-sm-3 col-form-label font-weight-bold"
            >
              Image 2
            </label>
            <div className="col-sm-9">
              <div class="mb-3">
                <input class="form-control" type="file" id="formFile" />
              </div>
            </div>
          </div>
          <div className="form-group row">
            <label
              for="inputPassword3"
              className="col-sm-3 col-form-label font-weight-bold"
            >
              Image 3
            </label>
            <div className="col-sm-9">
              <div class="mb-3">
                <input class="form-control" type="file" id="formFile" />
              </div>
            </div>
          </div> */}

          <div className="form-group row">
            <div className="justify-content-center">
              {update ? (
                <button
                  type="button"
                  className="btn btn-success btnqmaker  w-50 "
                  onClick={updateHandler}
                >
                  Update
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btnqmaker  w-50 "
                  onClick={addHandler}
                >
                  Add
                </button>
              )}
            </div>
          </div>
        </Form>
      </div>
      <Row xs={6} md={4} className="justify-content-center fontapply">
        {prodata &&
          prodata.map((prod, i) => (
            <Card
              key={i}
              style={{ width: "18rem", margin: "13px" }}
              className="bg-light bg-gradient card-hghlght cardcss"
            >
              <span>
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
                <small>{prod.product_desc}</small>
                <Card.Text className="mt-4">
                  <b>₹ {prod.product_cost}</b>
                  <br />
                </Card.Text>
                <Button
                  variant="danger"
                  // onClick={() => addCart(prod.id, prod)}
                  className="mb-2 cardbtn"
                  onClick={() => removeHandler(prod._id)}
                >
                  Remove Product
                </Button>
                <br />
                <Button
                  variant="info"
                  // onClick={() => addCart(prod.id, prod)}
                  className="mb-2 cardbtn"
                  onClick={() => editHandler(prod)}
                >
                  Edit
                </Button>
              </Card.Body>
            </Card>
          ))}
      </Row>
    </div>
  );
}else{
  return(
    <>You Cannot Access this Page</>
  )
}
  
}

export default AddProduct;
