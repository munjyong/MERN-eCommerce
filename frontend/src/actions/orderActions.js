import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
} from "../constants/orderConstants";
import axios from "axios";

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST });

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

    // POST request to create order
    const { data } = await axios.post("/api/orders", order, config);

    // If successful return the payload with user details
    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
