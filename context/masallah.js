import React, { useContext, useState } from "react";

const MasallahContext = React.createContext({
  currentLocation: "",
  currentDaska: "",
  setCurrentLocation: () => {},
  setCurrentDaska: () => {}
});

export const useMasallahContext = () => {
  return useContext(MasallahContext);
};

export const MasallahProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState("");
  const [currentDaska, setCurrentDaska] = useState("");

  return (
    <MasallahContext.Provider
      value={{
        setCurrentLocation: location => setCurrentLocation(location),
        setCurrentDaska: daska => setCurrentDaska(daska),
        currentLocation,
        currentDaska
      }}
    >
      {children}
    </MasallahContext.Provider>
  );
};

export default MasallahContext;
