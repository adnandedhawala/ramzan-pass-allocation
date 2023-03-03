import React, { useContext, useState } from "react";

const GlobalContext = React.createContext({
  showLoader: false,
  userData: {},
  selectedSidebarKey: "0",
  toggleLoader: () => {},
  setUserData: () => {},
  changeSelectedSidebarKey: () => {}
});

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const GlobalProvider = ({ children }) => {
  const [showLoader, setShowLoader] = useState(false);
  const [selectedSidebarKey, setSelectedSidebarKey] = useState("0");
  const [userData, setUserData] = useState({});

  const toggleLoader = flag => {
    setShowLoader(flag);
  };

  const changeSelectedSidebarKey = key => {
    setSelectedSidebarKey(key);
  };

  return (
    <GlobalContext.Provider
      value={{
        toggleLoader,
        showLoader,
        selectedSidebarKey,
        changeSelectedSidebarKey,
        userData,
        setUserData: data => setUserData(data)
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
