import React, { useState, useEffect } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { getCustAddress, deleteAddr } from "../../config/Myservice";
import AddAddrCheckout from "./AddAddrCheckout";
import EaddrCheckout from "./EaddrCheckout";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./Checkout.css";
import { encryptStorage } from "../../config/EncryptStorage";
function AddrCheckout() {
  const [alladdr, setAlladdr] = useState([]);
  const [showedit, setShowedit] = useState(false);
  const [addr, setAddr] = useState("");
  const [index, setIndex] = useState();
  const [addaddr, setAddaddr] = useState(false);
  const [selectedadd, setselectedadd] = useState();
  const [open, setOpen] = useState(false);
  const [alertmsg, setAlertmsg] = useState(false);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  useEffect(() => {
    
    setShowedit(false);

    const user = (encryptStorage.getItem("user"));
    const email = user.email;
    getCustAddress(email).then((res) => {
      if (res.data.err === 0) {
        setAlladdr(res.data.data);
        // console.log(res.data.data);
      }
    });
    localStorage.removeItem("selectedaddr");
  }, []);
  const deleteAdd = (id) => {
    const user = (encryptStorage.getItem("user"));
    const email = user.email;
    deleteAddr(email, { id }).then((res) => {
      if (res.data.err === 0) {
        getCustAddress(email).then((res) => {
          if (res.data.err === 0) {
            setAlladdr(res.data.data);
          }
        });
        // alert("Address Successfully Deleted");
        setAlertmsg("Address Successfully Deleted")
        setOpen(true)
      }
    });
  };
  const editHandler = (addr, i) => {
    setShowedit(true);
    setAddr(addr);
    setIndex(i);
  };

  const cardSelected = (addr) => {
    // $(this).addClass('selected');
    localStorage.setItem("selectedaddr", JSON.stringify(addr));
    setselectedadd(addr);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  if (alladdr.length === 0 || addaddr) {
    return <AddAddrCheckout />;
  } 
   else if (!showedit) {
    return (
      <div className="card  text-start  editprofile">
         <Snackbar
          open={open}
          autoHideDuration={2000}
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
          {selectedadd ? (
            <h2 className="fontapply">Address</h2>
          ) : (
            <h2 className="fontapply"> Select Address</h2>
          )}
          {selectedadd && (
            <div className="card mt-2">
              <div className="card-body text-start">
                <Row>
                  <Col xs={10}>
                    <h6 className="card-title">{selectedadd.address}</h6>
                    <p className="card-text">
                      {selectedadd.city} {selectedadd.pincode}
                      <br />
                      {selectedadd.state}
                      <br />
                      {selectedadd.country}
                    </p>
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </div>
        {selectedadd && (
          <h4 className="fontapply ml-4 mt-4"> Select Another Address</h4>
        )}

        <div className="card-body mt-2">
          {alladdr.map((add, i) => (
            <Col sm={9} key={i}>
              <input
                onClick={() => cardSelected(add)}
                className="form-check-input mt-5 mr-5"
                style={{ width: "20px", height: "20px" }}
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
              />

              <div className="card mt-2 selectedcard ml-2" id="selectedcard">
                <div className="card-body">
                  <Row>
                    <Col xs={10}>
                      <div>
                        <h6 className="card-title">{add.address}</h6>
                        <p className="card-text">
                          {add.city} {add.pincode}
                          <br />
                          {add.state}
                          <br />
                          {add.country}
                        </p>
                      </div>

                      <Button
                        className="mt-1"
                        onClick={() => editHandler(add, i)}
                      >
                        Edit
                      </Button>
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
                      {/* <input className="form-check-input  w-100 h-25" type="checkbox" value="" id="flexCheckChecked" 
                  style={{marginTop:"90px" ,marginLeft:"-20px"}} 
                  onClick={()=>cardSelected(add)}
                  /> */}
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          ))}
        </div>

        <div className="card-footer text-muted">
          {/* <Button variant="outline-dark">
            <i className="fa fa-save"></i> Save
          </Button>&nbsp; &nbsp; */}
          <Button variant="outline-dark" onClick={() => setAddaddr(true)}>
            <i className="fa fa-plus"></i> Add New Address
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <EaddrCheckout
        setShowedit={setShowedit}
        showedit={showedit}
        addr={addr}
        index={index}
        setAlladdr={setAlladdr}
      />
    );
  }
}

export default AddrCheckout;
