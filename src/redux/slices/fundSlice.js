import { createSlice } from "@reduxjs/toolkit";

const fundSlice = createSlice({
  name: "fund",

  initialState: {
    fundObj: null,
    ucObj:null
  },

  reducers: {
    setFundObj: (state, action) => {
      state.fundObj = action.payload;
    },
    clearFundObj: (state) => {
      state.fundObj = null;
    },
    resetFundState: (state) => {
      state.fundObj = null;
    },
    setUcObj: (state, action) => {
      state.ucObj = action.payload;
    },
    clearUcObj: (state) => {
      state.ucObj = null;
    },
    resetUcState: (state) => {
      state.ucObj = null;
    },
  },
});

export const { setFundObj, clearFundObj, resetFundState, setUcObj, clearUcObj, resetUcState } = fundSlice.actions;
export default fundSlice.reducer;