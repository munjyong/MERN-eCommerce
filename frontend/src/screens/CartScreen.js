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
  const productId = match.params.id;

  // ?quantity=3 === location.search.split('=') equals [['?quantity'][3]]
  // Gets only the quantity value
  const quantity = location.search ? Number(location.search.split("=")[1]) : 1;

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  console.log(cartItems);

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, quantity));
    }
  }, [dispatch, productId, quantity]);

  return <div>Cart</div>;
};

export default CartScreen;
