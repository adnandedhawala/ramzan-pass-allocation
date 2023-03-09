import React, { useContext, useState } from "react";

const MasallahContext = React.createContext({
  currentLocation: "",
  currentDaska: "",
  masallahList: [],
  masallahListWithUser: [],
  setCurrentLocation: () => {},
  setCurrentDaska: () => {},
  setMasallahList: () => {},
  setMasallahListWithUser: () => {}
});

export const useMasallahContext = () => {
  return useContext(MasallahContext);
};

export const MasallahProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState("");
  const [currentDaska, setCurrentDaska] = useState("");
  const [masallahList, setMasallahList] = useState([]);
  const [masallahListWithUser, setMasallahListWithUser] = useState([]);

  return (
    <MasallahContext.Provider
      value={{
        setCurrentLocation: location => setCurrentLocation(location),
        setCurrentDaska: daska => setCurrentDaska(daska),
        setMasallahList: list => setMasallahList(list),
        setMasallahListWithUser: list => setMasallahListWithUser(list),
        currentLocation,
        currentDaska,
        masallahList,
        masallahListWithUser
      }}
    >
      {children}
    </MasallahContext.Provider>
  );
};

export default MasallahContext;
