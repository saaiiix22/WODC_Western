import { configureStore, createStore } from "@reduxjs/toolkit";
import rootReducer from "./rooteReducer";

const store = configureStore({
    reducer : rootReducer
})
export default store