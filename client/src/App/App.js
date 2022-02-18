import logo from "./logo.svg";
import "./App.css";
import React from 'react'
import Footer from "../components/Footer/Footer";
import Navb from "../components/Navbar/Navb";
import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";
import Dashboard from "../components/Dashboard/Dashboard";
import ForgotPassword from "../components/Auth/ForgotPassword";
import Products from "../components/Products/Products";
import ChangePassword from "../components/Account/ChangePassword";
import ProdDetails from "../components/Products/ProdDetails";
import Cart from "../components/Cart/Cart";
import Profile from "../components/Account/Profile";
import Checkout from "../components/Checkout/Checkout";
import SimpleMap from "../components/Footer/SimpleMap";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddProduct from "../components/Admin/AddProduct";
import TxnList from "../components/Admin/TxnList";
// const Footer = React.lazy(() => import('../components/Footer/Footer'));
// const Navb = React.lazy(() => import('../components/Navbar/Navb'));
// const Login = React.lazy(() => import('../components/Auth/Login'));
// const Signup = React.lazy(() => import('../components/Auth/Signup'));
// const Dashboard = React.lazy(() => import('../components/Dashboard/Dashboard'));
// const ForgotPassword = React.lazy(() => import('../components/Auth/ForgotPassword'));
// const Products = React.lazy(() => import('../components/Products/Products'));
// const ProdDetails = React.lazy(() => import('../components/Products/ProdDetails'));
// const Cart = React.lazy(() => import('../components/Cart/Cart'));
// const Profile = React.lazy(() => import('../components/Account/Profile'));
// const Checkout = React.lazy(() => import('../components/Checkout/Checkout'));
// const SimpleMap = React.lazy(() => import('../components/Footer/SimpleMap'));



function App() {
  const [search, setSearch] = useState("");
  return (
    <div className="App">
      <Router>
        <Navb search={search} setSearch={setSearch} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route
            path="/products"
            element={<Products search={search} setSearch={setSearch} />}
          />
          <Route path="/products/:id" element={<ProdDetails />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/map" element={<SimpleMap />} />
          <Route path="/admin" element={<AddProduct />} />
          <Route path="/txnlist" element={<TxnList />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
