import React, { useEffect } from "react";

import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";

import { createOrder } from "../actions/orderActions";

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();

  // Get items from cart
  const cart = useSelector((state) => state.cart);

  // Ensures all numbers are to 2 decimal places
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  // Calc prices
  // Calc total items price
  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );
  // Calc shipping
  cart.shippingPrice = addDecimals(cart.itemsPrice < 100 ? 10 : 0);
  // Calc tax
  cart.taxPrice = addDecimals(Number(cart.itemsPrice * 0.2));
  // Calc total
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    // If order successfully placed
    if (success) {
      history.push(`/order/${order._id}`);
    }
    // eslint-disable-next-line
  }, [history, success]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>
            {/* All ordered items */}
            <ListGroup.Item>
              <h2>Order items</h2>
              {/* Check if there are items in cart */}
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty.</Message>
              ) : (
                <ListGroup variant="flush">
                  {/* Map through all cart items and output */}
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={2}>
                          <Image
                            src={item.image}
                            alt={item.anme}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.productId}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.quantity} x ${item.price} = $
                          {(item.quantity * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
