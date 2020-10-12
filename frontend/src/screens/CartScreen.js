import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";

import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";

import Message from "../components/Message";
import { addToCart } from "../actions/cartActions";

// location - Used to get the query string (?quantity=1) of the quantity amount
// history - Used to redirect the user
const CartScreen = ({ match, location, history }) => {
  // Get product id from URL
  const urlProductId = match.params.id;

  // ?quantity=3 === location.search.split('=') equals [['?quantity'][3]]
  // Gets only the quantity value
  const quantity = location.search ? Number(location.search.split("=")[1]) : 1;

  const dispatch = useDispatch();

  // useSelector() extracts data from the Redux store state
  const cart = useSelector((state) => state.cart);
  // Destructure cart items from cart
  const { cartItems } = cart;

  useEffect(() => {
    if (urlProductId) {
      dispatch(addToCart(urlProductId, quantity));
    }
  }, [dispatch, urlProductId, quantity]);

  const removeFromCartHandler = (id) => {
    console.log("Remove");
  };

  // If user is not logged in then proceed to /login
  // If user is logged in proceed to /shipping
  const checkoutHandler = () => {
    history.push("/login?redirect=shipping");
  };

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>Your cart is empty.</Message>
        ) : (
          // List all items in cart
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.productId}>
                <Row>
                  {/* Product Image */}
                  <Col md={2}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fluid
                      rounded
                    ></Image>
                  </Col>
                  {/* Product Name */}
                  <Col md={3}>
                    <Link to={`/product/${item.productId}`}>{item.name}</Link>
                  </Col>
                  {/* Price */}
                  <Col md={2}>{item.price}</Col>
                  {/* Change quantity */}
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.quantity}
                      onChange={(e) =>
                        dispatch(
                          addToCart(item.productId, Number(e.target.value))
                        )
                      }
                    >
                      {/* Maps through the item stock count */}
                      {/* Displays an option for each quantity until the maximum stock count */}
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  {/* Delete item from cart */}
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item.productId)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      {/* Subtotal and checkout */}
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal ({/* Add total quantity of items in cart */}
                {cartItems.reduce(
                  (accumulator, item) => accumulator + item.quantity,
                  0
                )}
                ) items
              </h2>
              <p>
                {/* Adds the total quantity by the price of each item */}$
                {cartItems
                  .reduce(
                    (accumulator, item) =>
                      accumulator + item.quantity * item.price,
                    0
                  )
                  // Forces 2 decimal places for the total price
                  .toFixed(2)}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
