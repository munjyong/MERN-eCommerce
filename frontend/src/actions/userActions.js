import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
} from "../constants/userConstants";

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
