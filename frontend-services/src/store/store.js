import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer";

const initialState = {
  // your initial state
};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
});

export default store;
