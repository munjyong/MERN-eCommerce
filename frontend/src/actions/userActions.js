import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_LOGOUT,
  USER_DETAILS_RESET,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
} from "../constants/userConstants";
import { ORDER_LIST_MY_RESET } from "../constants/orderConstants";

import axios from "axios";

// Login request to get token
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    // Declare content type so request can be parsed as JSON
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Extract email and password from route
    const { data } = await axios.post(
      "/api/users/login",
      { email, password },
      config
    );

    // If successful return the payload with email and password
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// User registration
export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    // Declare content type so request can be parsed as JSON
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Extract email and password from route
    const { data } = await axios.post(
      "/api/users",
      { name, email, password },
      config
    );

    // If successful return the payload with email and password
    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    });

    // Log in user after successful registration
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Get current user details
export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });

    // Get user JSON data from state
    const {
      userLogin: { userInfo },
    } = getState();

    // Declare content type so request can be parsed as JSON
    const config = {
      headers: {
        "Content-Type": "application/json",
        // Current users token
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // Get user info or profile
    const { data } = await axios.get(`/api/users/${id}`, config);

    // If successful return the payload with user details
    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }

    dispatch({
      type: USER_DETAILS_FAIL,
      payload: message,
    });
  }
};

// Update user profile details
export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST });

    // Get user JSON data from state
    const {
      userLogin: { userInfo },
    } = getState();

    // Declare content type so request can be parsed as JSON
    const config = {
      headers: {
        "Content-Type": "application/json",
        // Current users token
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // PUT request to update user profile
    const { data } = await axios.put(`/api/users/profile`, user, config);

    // If successful return the payload with user details
    dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: data,
    });

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }

    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload: message,
    });
  }
};

// User logout
export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("cartItems");
  localStorage.removeItem("shippingAddress");
  localStorage.removeItem("paymentMethod");
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_DETAILS_RESET });
  dispatch({ type: USER_LIST_RESET });
  dispatch({ type: ORDER_LIST_MY_RESET });
  document.location.href = "/login";
};

// List all users
export const listUsers = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LIST_REQUEST });

    // Get user JSON data from state
    const {
      userLogin: { userInfo },
    } = getState();

    // Declare content type so request can be parsed as JSON
    const config = {
      headers: {
        // Current users token
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // PUT request to update user profile
    const { data } = await axios.get("/api/users", config);

    // If successful return the payload with user details
    dispatch({
      type: USER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }

    dispatch({
      type: USER_LIST_FAIL,
      payload: message,
    });
  }
};

// Delete a user
export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DELETE_REQUEST });

    // Get user JSON data from state
    const {
      userLogin: { userInfo },
    } = getState();

    // Declare content type so request can be parsed as JSON
    const config = {
      headers: {
        // Current users token
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/users/${id}`, config);

    // If successful return the payload with user details
    dispatch({
      type: USER_DELETE_SUCCESS,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }

    dispatch({
      type: USER_DELETE_FAIL,
      payload: message,
    });
  }
};

// Update user info (Admin)
export const updateUser = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST });

    // Get user JSON data from state
    const {
      userLogin: { userInfo },
    } = getState();

    // Declare content type so request can be parsed as JSON
    const config = {
      headers: {
        "Content-Type": "application/json",
        // Current users token
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`/api/users/${user._id}`, user, config);

    dispatch({
      type: USER_UPDATE_SUCCESS,
    });
    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }

    dispatch({
      type: USER_UPDATE_FAIL,
      payload: message,
    });
  }
};
