

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserProfileDetails, MenuList } from '../../services/authService';

export const fetchMenu = createAsyncThunk(
  "menu/fetchMenu",
  async (_, { rejectWithValue }) => {
    try {
      const res = await MenuList();
      return res?.data?.data ?? [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch menu");
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  "menu/fetchUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      const res = await UserProfileDetails();
      return res?.data?.data ?? {};
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch user details");
    }
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    menuData: [],
    userDetails: {},
    activeMenu: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setActiveMenu(state, action) {
      state.activeMenu = state.activeMenu === action.payload ? null : action.payload;
    },
    clearMenu(state) {
      state.menuData = [];
      state.userDetails = {};
      state.activeMenu = null;
      state.isLoading = false;
      state.error = null;
    },
    setMenuData(state, action) {
      state.menuData = action.payload;
    },
    setUserDetails(state, action) {
      state.userDetails = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.menuData = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error;
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDetails = action.payload || {};
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error;
      });
  },
});

export const { setActiveMenu, clearMenu, setMenuData, setUserDetails } = menuSlice.actions;
export default menuSlice.reducer;