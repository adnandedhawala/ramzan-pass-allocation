import React, { useContext, useState } from "react";

const MasallahContext = React.createContext({
  currentLocation: "",
  currentDaska: "",
  masallahList: [],
  setCurrentLocation: () => {},
  setCurrentDaska: () => {},
  setMasallahList: () => {}
});

export const useMasallahContext = () => {
  return useContext(MasallahContext);
};

export const MasallahProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState("");
  const [currentDaska, setCurrentDaska] = useState("");
  const [masallahList, setMasallahList] = useState([]);

  return (
    <MasallahContext.Provider
      value={{
        setCurrentLocation: location => setCurrentLocation(location),
        setCurrentDaska: daska => setCurrentDaska(daska),
        setMasallahList: list => setMasallahList(list),
        currentLocation,
        currentDaska,
        masallahList
      }}
    >
      {children}
    </MasallahContext.Provider>
  );
};

export default MasallahContext;
