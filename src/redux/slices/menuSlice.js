import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserProfileDetails, MenuList } from "../../services/authService";

/* ---------------- HELPERS ---------------- */

const extractAllPaths = (menus = []) => {
  let paths = [];

  menus.map((menu) => {
    if (menu.link && menu.link !== "#") {
      paths.push(menu.link);
    }

    if (menu.subMenu?.length) {
      paths = paths.concat(extractAllPaths(menu.subMenu));
    }
  });

  return paths;
};

/* ---------------- THUNKS ---------------- */

export const fetchMenu = createAsyncThunk(
  "menu/fetchMenu",
  async (_, { rejectWithValue }) => {
    try {
      const res = await MenuList();
      return res?.data?.data ?? [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch menu"
      );
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
      return rejectWithValue(
        err.response?.data || "Failed to fetch user details"
      );
    }
  }
);

/* ---------------- SLICE ---------------- */

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    menuData: [],
    allPaths: [],
    userDetails: {},
    activeMenu: null,
    isLoading: false,
    error: null,
  },

  reducers: {
    setActiveMenu(state, action) {
      state.activeMenu =
        state.activeMenu === action.payload
          ? null
          : action.payload;
    },

    addAllowedPath(state, action) {
      const path = action.payload;

      if (!state.allPaths.includes(path)) {
        state.allPaths.push(path);
      }
    },

    clearMenu(state) {
      state.menuData = [];
      state.allPaths = [];
      state.userDetails = {};
      state.activeMenu = null;
      state.isLoading = false;
      state.error = null;
    },

    setMenuData(state, action) {
      state.menuData = action.payload || [];
      state.allPaths = extractAllPaths(action.payload || []);
    },

    setUserDetails(state, action) {
      state.userDetails = action.payload || {};
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

        const menuArray = Array.isArray(action.payload)
          ? action.payload
          : [];

        state.menuData = menuArray;
        state.allPaths = extractAllPaths(menuArray);
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



export const {
  setActiveMenu,
  clearMenu,
  setMenuData,
  setUserDetails,
  addAllowedPath
} = menuSlice.actions;

export default menuSlice.reducer;
