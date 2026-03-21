import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
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

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  }

  const token = getCookie("SESSION_SECRET_TOKEN");
  console.log(token);


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
