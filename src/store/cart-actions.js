import { uiActions } from "./ui-slice";
import { cartActions } from "./cart-slice";

export const fetchCartData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      let request = {
        filters: [
          { key: "status", values: ["ACTIVE"], operator: "=", variant: "NONE" },
        ],
      };

      const response = await fetch("http://localhost:8081/cart/view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(
          `Couldn't fetch cart data! - HTTP error: ${response.status}`
        );
      }

      let cartData = await response.json();
      return cartData;
    };

    try {
      const cartData = await fetchData();
      dispatch(
        cartActions.replaceCart({
          items: cartData || [],
          //   totalQuantity: cartData.totalQuantity,
          totalQuantity: cartData.length,
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Fetching cart data failed!",
        })
      );
    }
  };
};

export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending cart data!",
      })
    );

    const sendRequest = async () => {
      // Server save is dummy, delete all and save what we sending
      const response = await fetch("http://localhost:8081/cart/save", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(cart.items), // {name, quantity, price, totalPrice}
      });

      if (!response.ok) {
        throw new Error(
          `Sending cart data failed, HTTP error: ${response.status}`
        );
      }

      const responseDate = await response.json();
    };

    try {
      await sendRequest();

      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Sent cart data successfully!",
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Sending cart data failed!",
        })
      );
    }
  };
};
