import React, { useEffect } from "react";

import { Row, Col } from "react-bootstrap";

import Product from "../components/Product";

import { useDispatch, useSelector } from "react-redux";

import { listProducts } from "../actions/productActions";

const HomeScreen = () => {
  // Dispatch actions
  const dispatch = useDispatch();

  // useSelector() extracts data from the Redux store state
  const productList = useSelector((state) => state.productList);
  // Destructure productList to pass variables into the component
  const { loading, products, error } = productList;

  useEffect(() => {
    // Fire action to fetch products
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <>
      <h1>Latest Products</h1>
      {/* Loading spinner */}
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h3>{error}</h3>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default HomeScreen;
