import { useDisclosure } from "@mantine/hooks";
import React, { createContext, useContext } from "react";

const AsideContext = createContext();

const AsideProvider = ({ children }) => {
  const [isAsideOpened, { toggle: toggleAside, close: closeAside }] =
    useDisclosure(false);

  return (
    <AsideContext.Provider value={{ isAsideOpened, toggleAside, closeAside }}>
      {children}
    </AsideContext.Provider>
  );
};

export const useAsideContext = () => {
  const context = useContext(AsideContext);
  return context;
};

export default AsideProvider;
