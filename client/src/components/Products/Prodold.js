import React, { useState, useEffect } from "react";
import { Button, Row, Container, Card, Col } from "react-bootstrap";
import "./Products.css";
import { getProducts } from "../../config/Myservice";
function Products() {
  const [productdata, setProductData] = useState([]);
  const [prodata, setProdata] = useState([]);
  useEffect(() => {
    getProducts().then((res, err) => {
      if (err) throw err;
      else {
        setProductData(res.data.data);
        setProdata(res.data.data);
        console.log(res.data.data);
      }
    });
  }, []);
  return (
    <div>
      <div className="sidebar floatleft">
        <a className="" href="#home">
          Home
        </a>
        <a href="#contact">Contact</a>
        <a>
          <button className="btn btn-outline-dark" type="button">
            All Products
          </button>
        </a>
        <div className="dropdown">
          <a>
            <button
              className="btn btn-outline-dark dropdown-toggle"
              type="button"
              id="dropdownMenu2"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Dropdown
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
              <button className="dropdown-item" type="button">
                Action
              </button>
              <button className="dropdown-item" type="button">
                Another action
              </button>
              <button className="dropdown-item" type="button">
                Something else here
              </button>
            </div>
          </a>
        </div>
      </div>

      <div className="content">
        <Container className="mt-4">
          <Row xs={6} md={4} className="justify-content-center fontapply">
            {prodata.length > 0 &&
              prodata.map((prod, i) => (
                <Card
                  // key={i}
                  style={{ width: "18rem", margin: "13px" }}
                  className="bg-light bg-gradient card-hghlght "
                  onClick={() => alert("clicked on card")}
                >
                  <Card.Img
                    variant="top"
                    src={prod.product_subImages[0]}
                    className="mt-1 bg-gradient"
                    width="200"
                    height="250"
                  />
                  <Card.Body className="mt-auto">
                    <Card.Title className="mt-1">
                      {prod.product_name}
                    </Card.Title>
                    {/* <Card.Text> {prod.quantity}</Card.Text> */}
                    <Card.Text className="mt-4">
                      <b>₹ {prod.product_cost}</b>
                    </Card.Text>
                    <Button
                      variant="danger"
                      // onClick={() => addCart(prod.id, prod)}
                      className=""
                    >
                      Add to Cart
                    </Button>
                  </Card.Body>
                </Card>
              ))}
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Products;
