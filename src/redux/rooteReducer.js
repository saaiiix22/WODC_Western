import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import menuReducer from './slices/menuSlice';
import projectReducer from "./slices/projectSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    menu: menuReducer,
    project: projectReducer,
})
export default rootReducer