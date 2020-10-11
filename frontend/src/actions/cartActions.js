import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "../constants/cartConstants";
import axios from "axios";

// Add to cart action
export const addToCart = (id, quantity) => async (dispatch, getState) => {
  // Get data from API with axios
  const { data } = await axios.get(`/api/products/${id}`);

  // Fire dispatch function
  dispatch({
    // Assign type and payload
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      quantity,
    },
  });

  // Set cart items with localStorage
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};
