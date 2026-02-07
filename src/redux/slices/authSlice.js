import { createSlice } from "@reduxjs/toolkit";
import { loginUser, logoutUser } from "./authThunks";


const authSlice = createSlice({
    name: "authSlice",
    initialState: {
        token: localStorage.getItem("token") || null,
        user: null,
        captchaId: null,
        captchaImage: null,
        loading: false,
        error: null,
        isAuthenticated: !!localStorage.getItem("token"),
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            
            localStorage.setItem("token", action.payload.token);
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem("token");
        },
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setMenu: (state, action) => {
            state.menu = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload && action.payload.outcome === true && action.payload.data) {
                    state.token = action.payload.data.token || action.payload.data;
                    state.user = action.payload.data.user;
                    state.isAuthenticated = true;

                    if (state.token) {
                        localStorage.setItem("token", state.token);
                    }
                } else if (action.payload && action.payload.token) {

                    state.token = action.payload.token;
                    state.user = action.payload.user;
                    state.isAuthenticated = true;
                    localStorage.setItem("token", action.payload.token);
                } else if (action.payload && action.payload.outcome === false) {

                    state.token = null;
                    state.user = null;
                    state.isAuthenticated = false;
                    localStorage.removeItem("token");
                    state.error = action.payload.message || "Login failed";
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.token = null;
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem("token");
            })
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.token = null;
                state.user = null;
                state.captchaId = null;
                state.captchaImage = null;
                state.isAuthenticated = false;
                localStorage.removeItem("token");
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.token = null;
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem("token");
            });
    },
})

export const { loginSuccess, logout, clearError, setUser, setMenu } = authSlice.actions;
export default authSlice.reducer;