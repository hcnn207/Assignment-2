import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  newOrders: [],
  paidOrders: [],
  deliveredOrders: []
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    createOrder: (state, action) => {
      const cartItems = action.payload;

      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const newOrder = {
        id: Date.now(),
        items: totalItems,
        total: totalPrice,
        products: cartItems
      };

      state.newOrders.unshift(newOrder);
    },

    payOrder: (state, action) => {
      const orderId = action.payload;
      const orderIndex = state.newOrders.findIndex((order) => order.id === orderId);

      if (orderIndex !== -1) {
        const [order] = state.newOrders.splice(orderIndex, 1);
        state.paidOrders.unshift(order);
      }
    },

    receiveOrder: (state, action) => {
      const orderId = action.payload;
      const orderIndex = state.paidOrders.findIndex((order) => order.id === orderId);

      if (orderIndex !== -1) {
        const [order] = state.paidOrders.splice(orderIndex, 1);
        state.deliveredOrders.unshift(order);
      }
    },

    clearOrders: (state) => {
      state.newOrders = [];
      state.paidOrders = [];
      state.deliveredOrders = [];
    }
  }
});

export const {
  createOrder,
  payOrder,
  receiveOrder,
  clearOrders
} = orderSlice.actions;

export default orderSlice.reducer;