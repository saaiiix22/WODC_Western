import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import menuReducer from './slices/menuSlice';
import projectReducer from "./slices/projectSlice";
import fundReducer from './slices/fundSlice'

const rootReducer = combineReducers({
    auth: authReducer,
    menu: menuReducer,
    project: projectReducer,
    fund:fundReducer
})
export default rootReducer