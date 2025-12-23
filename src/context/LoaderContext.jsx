import { createContext, useContext, useEffect, useState } from "react";
import { loaderStore } from "../utils/loaderStore";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loaderStore.show = () => setLoading(true);
    loaderStore.hide = () => setLoading(false);
  }, []);

  return (
    <LoaderContext.Provider value={{ loading }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
