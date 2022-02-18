import React, { useEffect, useState } from "react";
import { Button, Row, Col, Container, Form } from "react-bootstrap";
import { getOrderDetails } from "../../config/Myservice";
import { jsPDF } from "jspdf";
import logo from "./logo.png";
import { encryptStorage } from "../../config/EncryptStorage";
function Orders() {
  const [orderData, setorderData] = useState([]);
  const [userdata, setUserdata] = useState();
  useEffect(() => {
    
    const user = (encryptStorage.getItem("user"));
    const email = user.email;
    setUserdata(user);
    getOrderDetails(email).then((res) => {
      if (res.data.err === 0) {
        // console.log(res.data.data);
        setorderData(res.data.data);
      }
    });
  }, []);
  const invoiceGen = (order) => {
    const doc = new jsPDF();
  
    doc.addImage(`${logo}`, 10, 15, 35, 35);
    // doc.setTextColor(255, 0, 0)

    doc
      .setFontSize(25)

      // .text(`NeoStore`, 50, 25);
      doc.setTextColor(100)
    doc
      .setFontSize(13)
      .text(`STATUS: Unpaid`, 200, 40, { align: "right" })
      .text(`Invoice Date: ${order.created_at}`, 200, 50, { align: "right" });
    // .moveDown();
    doc
      .setFontSize(12)
      .text(`Invoice Number: ${Math.round(Math.random() * 100000)}`, 10, 65)
      // .text(`Invoice Date: ${invoice.invoicedate}`, 50, 215)
      .text(`TO : `, 10, 85)
      .text(`Name: ${userdata.fname} ${userdata.lname}`, 10, 90)
      .text(
        `Address: ${order.address.address} ${order.address.city} ${order.address.pincode}, ${order.address.state}, ${order.address.country}`,
        10,
        95
      )
      .text(
        `Payment ID: ${order.paymentdetails.razorpayPaymentId}`,10,110
      )
      .text(
        `Razorpay Order ID: ${order.paymentdetails.razorpayOrderId}`,10,115
      )
      // .text(`STATUS: Unpaid`, 200, 130, { align: 'right' })
      // .text(`Invoice Date: ${datetime}`, 200, 142, { align: 'right' })
      // .text(`Due Date: ${invoice.duedate}`, 200, 154, { align: 'right' })
      .text(
        `TOTAL AMOUNT: ${order.total}`,
        200,
        500,
        { align: "right" },
        10,
        100
      );
    // .fontSize(10)

    doc.setFontSize(12);
    let spacing = 130;

    doc.text("#".toString(), 10, spacing + 5);
    doc.text("Product Name", 25, spacing + 6);
    // doc.text(item.product_producer,25,spacing)
    doc.text("Quantity".toString(), 120, spacing + 8);
    doc.text("Price".toString(), 155, spacing + 8);
    doc.text("Total".toString(), 180, spacing + 8);

    order.cartitems.forEach((item, id) => {
      spacing += 20;
      doc.text((id + 1).toString(), 10, spacing + 4);
      doc.text(item.product_name, 25, spacing + 5);
      // doc.text(item.product_producer,25,spacing)
      doc.text(item.quantity.toString(), 120, spacing + 7);
      doc.text(item.product_cost.toString(), 155, spacing + 7);
      doc.text(
        (item.quantity * item.product_cost).toString(),
        180,
        spacing + 7
      );
    });

    doc.setLineWidth(0.5);
    doc.line(100, spacing + 20, 200, spacing + 20);
    doc.text("SubTotal :", 140, spacing + 30);
    doc.text(
      Math.round(order.total + order.total * (5 / 100)).toString(),
      180,
      spacing + 30
    );
    doc.text("GST(5%) :", 140, spacing + 37);
    doc.text(Math.round(order.total * (5 / 100)).toString(), 180, spacing + 37);

    doc.text("Total :", 140, spacing + 46);
    doc.text(order.total.toString(), 180, spacing + 46);

    

    doc.save(`${order.email}order.pdf`);
  };
  return (
    <div>
      <div className="card  text-start  editprofile">
        <div className="card-header">
          <h2 className="fontapply">Orders</h2>
        </div>
        <div className="card-body mt-2">
          {orderData.map((order, i) => (
            <Col sm={9} key={i}>
              <div className="card mt-2">
                <div className="card-body">
                  <Row>
                    <Col xs={10}>
                      <h5 className="card-title text-danger">TRANSIT</h5>
                      <p className="card-text">
                        <b>Placed on :</b> {order.created_at}
                        <br />
                        <b>Payment ID: </b> {order.paymentdetails.razorpayPaymentId}<br/>
                        
                        <b>Razorpay OrderId: </b> {order.paymentdetails.razorpayOrderId}<br/>


                        <b>Total: ₹ {order.total}</b>
                      </p>
                      {order.cartitems.map((imgn) => (
                        <img
                          // src={imgn.product_subImages[0]}
                          src= {`http://localhost:9999/${imgn.product_subImages[0]}`}

                          width="80"
                          height="80"
                          className="mr-2"
                        />
                      ))}

                      <br />
                      <Button
                        // href={`http://localhost:9999/${order.invoicename}`}
                        // target="_blank"
                        className="mt-2"
                        // download={order.invoicename}
                        onClick={() => invoiceGen(order)}
                      >
                        Download Invoice as Pdf
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Orders;
