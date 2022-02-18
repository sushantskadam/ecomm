import React, { useState, useEffect, useRef } from "react";
import { Button, Row, Col, Container, Form } from "react-bootstrap";
import { getCustAddress, deleteAddr } from "../../config/Myservice";
import EditAddress from "./EditAddress";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {encryptStorage} from '../../config/EncryptStorage'

function Address({ setShowadd, showadd }) {
  const [alladdr, setAlladdr] = useState([]);
  const [showedit, setShowedit] = useState(false);
  const [addr, setAddr] = useState("");
  const [index, setIndex] = useState();
  const [open, setOpen] = useState(false);
  const [alertmsg, setAlertmsg] = useState(false);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  useEffect(() => {
    
    setShowedit(false);

    const user = (encryptStorage.getItem("user"));
    const email = user.email;
    getCustAddress(user.email).then((res) => {
      if (res.data.err == 0) {
        setAlladdr(res.data.data);
        // console.log(res.data.data);
      }
    });
  }, []);
  const deleteAdd = (id) => {
    const user = (encryptStorage.getItem("user"));
    const email = user.email;
    deleteAddr(email, { id }).then((res) => {
      if (res.data.err == 0) {
        getCustAddress(email).then((res) => {
          if (res.data.err == 0) {
            setAlladdr(res.data.data);
          }
        });
        // alert("Address Successfully Deleted");
        setAlertmsg("Address Successfully Deleted");
        setOpen(true);
      }
    });
  };
  const editHandler = (addr, i) => {
    console.log(addr);
    setShowedit(true);
    setAddr(addr);
    setIndex(i);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  if (!showedit) {
    return (
      <div className="card  text-start  editprofile">
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
        <div className="card-header">
          <h2 className="fontapply">Addresses</h2>
        </div>

        <div className="card-body mt-2">
          {alladdr.map((add, i) => (
            <Col sm={9} key={i}>
              <div className="card mt-2">
                <div className="card-body">
                  <Row>
                    <Col xs={10}>
                      <h6 className="card-title">{add.address}</h6>
                      <p className="card-text">
                        {add.city} {add.pincode}
                        <br />
                        {add.state}
                        <br />
                        {add.country}
                      </p>
                      <Button onClick={() => editHandler(add, i)}>Edit</Button>
                    </Col>
                    <Col xs={1}>
                      <Button
                        aria-label="Close"
                        variant="danger"
                        size="sm"
                        onClick={() => deleteAdd(add._id)}
                      >
                        <i className="fa fa-times" aria-hidden="true"></i>
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          ))}
        </div>

        <div className="card-footer text-muted"></div>
      </div>
    );
  } else {
    return (
      <EditAddress
        setShowedit={setShowedit}
        showedit={showedit}
        addr={addr}
        index={index}
        setAlladdr={setAlladdr}
      />
    );
  }
}

export default Address;
