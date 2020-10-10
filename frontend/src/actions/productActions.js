import {
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
} from "../constants/productContants";

import axios from "axios";

export const listProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });

    // Fetch data from API
    const { data } = await axios.get("/api/products");

    // If successful assign the product data to the payload
    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        // Display a custom error message is it exists
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
