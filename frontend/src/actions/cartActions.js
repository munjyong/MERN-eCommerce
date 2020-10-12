import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "../constants/cartConstants";
import axios from "axios";

// Add to cart action
// getState - gets all of the items in the cart currently (if any)
export const addToCart = (id, quantity) => async (dispatch, getState) => {
  // Get data from API with axios
  const { data } = await axios.get(`/api/products/${id}`);

  // Fire dispatch function
  dispatch({
    // Assign type and payload
    type: CART_ADD_ITEM,
    payload: {
      productId: data._id,
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

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};
