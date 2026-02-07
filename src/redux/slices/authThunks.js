import { toast } from 'react-toastify';
import {loginService, logoutService} from '../../services/authService'
import { createAsyncThunk } from "@reduxjs/toolkit";

const MIN_LOADING_TIME = 500;

const withMinimumLoadingTime = (asyncOperation) => {
  return async (...args) => {
    const startTime = Date.now();
    const result = await asyncOperation(...args);
    const elapsed = Date.now() - startTime;
    
    if (elapsed < MIN_LOADING_TIME) {
      await new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME - elapsed));
    }
    return result;
  };
};

export const loginUser = createAsyncThunk( "auth/loginUser", withMinimumLoadingTime(async (encryptedPayload, { rejectWithValue }) => {
    try {
      const res = await loginService(encryptedPayload);
      console.log(res);
      if(res?.status === 200 && res?.data.outcome){
        toast.success("Login Successful")
      }
      else{
        toast.error("Login Failed")
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  })
);

export const logoutUser = createAsyncThunk("auth/logoutUser", withMinimumLoadingTime(async (encryptedPayload, { rejectWithValue }) => {
    try {
      const res = await logoutService(encryptedPayload);
      console.log(res);
      
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Logout failed");
    }
  })
);
