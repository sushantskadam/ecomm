import React from "react";
import {
  Box,
  Container,
  Row,
  Column,
  FooterLink,
  Heading,
} from "./FooterStyles";
import { Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <Box className="box">
      {/* <h1 style={{ color: "#EA1111", 
                   textAlign: "center", 
                   marginTop: "-30px" }}>
        NeoSTORE
      </h1> */}
      <Container>
        <Row>
          <Column>
            <Heading>About Us</Heading>
            <FooterLink style={{ color: "white" }}>
              NeoSOFT is a SEI-CMMI Level 5 and ISO 9001:2008 certified global
              IT consulting And software solutions provider with 4000+ software
              consultants working full time across 8 delivery centers.{" "}
            </FooterLink>
          </Column>
          <Column>
            <Heading>Information</Heading>
            <FooterLink href="http://localhost:3000/terms.pdf" target="_blank">
              Terms And Condtions
            </FooterLink>
            <FooterLink href="#">Return Policy</FooterLink>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink
              style={{ cursor: "pointer", color: "white" }}
              onClick={() => navigate("/map")}
            >
              Locate Us
            </FooterLink>
          </Column>
          <Column>
            <Heading>Newsletter</Heading>
            <FooterLink style={{ color: "white" }}>
              Signup to get executive offer from our favorite Brand
            </FooterLink>
            <FooterLink>
              <input
                type="email"
                className="form-control"
                placeholder="Your Email..."
              ></input>
            </FooterLink>
            {/* <FooterLink href="#">Indore</FooterLink> */}
            <FooterLink >
              <Button
                variant="light"
                data-toggle="modal"
                data-target="#exampleModal"
              >
                Subscribe
              </Button>
            </FooterLink>
          </Column>
          <Column>
            <Heading>Social Media</Heading>
            <FooterLink href="#">
              <i className="fa fa-facebook-f">
                <span style={{ marginLeft: "10px" }}>Facebook</span>
              </i>
            </FooterLink>
            <FooterLink href="#">
              <i className="fa fa-instagram">
                <span style={{ marginLeft: "10px" }}>Instagram</span>
              </i>
            </FooterLink>
            <FooterLink href="#">
              <i className="fa fa-twitter">
                <span style={{ marginLeft: "10px" }}>Twitter</span>
              </i>
            </FooterLink>
            <FooterLink href="#">
              <i className="fa fa-youtube">
                <span style={{ marginLeft: "10px" }}>Youtube</span>
              </i>
            </FooterLink>
          </Column>
        </Row>
      </Container>
      <div
        className="modal fade"
        id="exampleModal"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Subscribed Successfully
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <img
                width="300px"
                height="100%"
                src="https://www.mrgentlemansguide.com/wp-content/uploads/2015/09/thank-you-for-subscribing-e1520973052893.png"
              ></img>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              {/* <button type="button" className="btn btn-primary">Save changes</button> */}
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};
export default Footer;
