import React, { useState, useEffect } from "react";

import { Form, Button, Row, Col } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";

import Message from "../components/Message";
import Loader from "../components/Loader";

import { getUserDetails, updateUserProfile } from "../actions/userActions";

const ProfileScreen = ({ location, history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Get success state value
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  useEffect(() => {
    if (!userInfo) {
      // Redirect user if they are not already logged in
      history.push("/login");
    } else {
      if (!user.name) {
        dispatch(getUserDetails("profile"));
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [dispatch, history, userInfo, user]);

  const submitHandler = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
    } else {
      // Dispatch update profile
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
    }
  };

  return (
    <Row>
      {/* User details */}
      <Col md={3}>
        <h2>User Profile</h2>
        {/* Display error message */}
        {message && <Message variant="danger">{message}</Message>}
        {success && <Message variant="success">Profile Updated</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {/* Display loader */}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              z
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm new password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit">Update</Button>
        </Form>
      </Col>
      {/* User orders */}
      <Col md={9}>
        <h2>My orders</h2>
      </Col>
    </Row>
  );
};

export default ProfileScreen;
