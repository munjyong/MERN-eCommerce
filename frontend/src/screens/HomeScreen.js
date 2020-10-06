import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import axios from "axios";

const HomeScreen = () => {
  // State declaration in func. components
  // products is the state name, setProducts is the function to manipulate state
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const { data } = await axios.get("api/products");

    setProducts(data);
  };

  // Runs as soon as the component loads
  // Therefore the requests for the products should go inside
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeScreen;
