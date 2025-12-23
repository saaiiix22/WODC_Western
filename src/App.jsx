import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { fetchUserDetails } from "./redux/slices/menuSlice";
import { LoaderProvider } from "./context/LoaderContext";

const queryClient = new QueryClient();

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchUserDetails());
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LoaderProvider>
          <AppRouter />
        </LoaderProvider>
        <ToastContainer />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
