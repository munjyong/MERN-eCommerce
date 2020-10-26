import React, { useEffect } from "react";

import { Row, Col } from "react-bootstrap";

import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Pagiante from "../components/Paginate";

import { useDispatch, useSelector } from "react-redux";

import { listProducts } from "../actions/productActions";
import Paginate from "../components/Paginate";

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword;

  const pageNumber = match.params.pageNumber || 1;

  // Dispatch actions
  const dispatch = useDispatch();

  // useSelector() extracts data from the Redux store state
  const productList = useSelector((state) => state.productList);
  // Destructure states from reducers
  const { loading, products, error, page, pages } = productList;

  useEffect(() => {
    // Fire action to fetch products
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <h1>Latest Products</h1>
      {/* Loading spinner */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
