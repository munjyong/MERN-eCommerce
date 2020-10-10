import {
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
} from "../constants/productContants";

import axios from "axios";

export const listProducts = () => async (dispatch) => {
  try {
    // Request to fetch products
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

export const listProductDetails = (id) => async (dispatch) => {
  try {
    // Request to fetch product
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    // Fetch data from API
    const { data } = await axios.get(`/api/products/${id}`);

    // If successful assign the product data to the payload
    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        // Display a custom error message is it exists
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
