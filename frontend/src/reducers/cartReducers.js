import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "../constants/cartConstants";

// Cart reducer
export const cartReducer = (state = { cartItems: [] }, action) => {
  // Switch case of the constants
  switch (action.type) {
    case CART_ADD_ITEM:
      // Assign payload
      const item = action.payload;
      // Search for matching product id's between the payload and state cartItems
      const existingItem = state.cartItems.find(
        (x) => x.productId === item.productId
      );
      // If item exists in cart
      if (existingItem) {
        // Return the state and payload
        // Else return the product
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.productId === existingItem.productId ? item : x
          ),
        };
      } else {
        // Else return the state & add item into cartItems
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => item.productId !== action.payload
        ),
      };
    default:
      return state;
  }
};
