import { createSlice } from "@reduxjs/toolkit";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  starWars,
} from "unique-names-generator";

const initialState = {
  carts: [],
  userId: "",
  loader: false,
};

// card slice
const cartSlice = createSlice({
  name: "cartslice",
  initialState,
  reducers: {
    // Set user id
    setUserId: (state) => {
      const randomName = uniqueNamesGenerator({
        dictionaries: [starWars],
      });

      state.userId = randomName;
    },

    setLoader: (state, action) => {
      state.loader = action.payload;
    },

    // add to cart
    addToCart: (state, action) => {
      const IteamIndex = state.carts.findIndex(
        (iteam) => iteam.id === action.payload.id
      );

      if (IteamIndex >= 0) {
        state.carts[IteamIndex].qnty += 1;
      } else {
        const temp = { ...action.payload, qnty: 1 };
        state.carts = [...state.carts, temp];
      }
    },

    // remove perticular iteams
    removeToCart: (state, action) => {
      const data = state.carts.filter((ele) => ele.id !== action.payload);
      state.carts = data;
    },

    // remove single iteams
    removeSingleIteams: (state, action) => {
      const IteamIndex_dec = state.carts.findIndex(
        (iteam) => iteam.id === action.payload.id
      );

      if (state.carts[IteamIndex_dec].qnty >= 1) {
        state.carts[IteamIndex_dec].qnty -= 1;
      }
    },

    // clear cart
    emptycartIteam: (state, action) => {
      state.carts = [];
    },
  },
});

export const {
  setUserId,
  addToCart,
  removeToCart,
  removeSingleIteams,
  emptycartIteam,
  setLoader,
} = cartSlice.actions;

export default cartSlice.reducer;
