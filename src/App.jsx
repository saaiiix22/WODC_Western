import React from "react";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/auth/Login";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <AppRouter />
          <ToastContainer />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
