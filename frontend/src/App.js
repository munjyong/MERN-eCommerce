import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

import "./bootstrap.min.css";
import "./scss/styles.scss";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Route path="/login" component={LoginScreen} />
          {/* :id acts as a placeholder, anything after /product/ will be considered as the product id */}
          <Route path="/product/:id" component={ProductScreen} />
          {/* ? acts as optional tag as the user may visit the cart screen without any items in cart */}
          <Route path="/cart/:id?" component={CartScreen} exact />
          <Route path="/" component={HomeScreen} exact />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
