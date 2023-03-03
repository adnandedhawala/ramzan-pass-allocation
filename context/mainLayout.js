import React, { useContext, useState } from "react";

const MainLayoutContext = React.createContext({
  pageTitle: false,
  sidebar: null,
  statsInfo: null,
  searchBar: null,
  cta: null,
  showBack: false,
  isPageLoaded: false,
  setPageTitle: () => {},
  setIsPageLoaded: () => {},
  setSidebar: () => {},
  setStatsInfo: () => {},
  setSearchbar: () => {},
  setCta: () => {},
  setShowBack: () => {},
  resetPage: () => {}
});

export const useMainLayoutContext = () => {
  return useContext(MainLayoutContext);
};

export const MainLayoutProvider = ({ children }) => {
  const [pageTitle, setPageTitle] = useState("");
  const [sidebar, setSidebar] = useState(null);
  const [showBack, setShowBack] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [statsInfo, setStatsInfo] = useState(null);
  const [searchBar, setSearchbar] = useState(null);
  const [cta, setCta] = useState(null);

  const resetPage = () => {
    setPageTitle("");
    setSidebar(null);
    setSearchbar(null);
    setShowBack(false);
    setStatsInfo(null);
    setCta(null);
  };

  return (
    <MainLayoutContext.Provider
      value={{
        setPageTitle: title => setPageTitle(title),
        setSidebar: node => setSidebar(node),
        setStatsInfo: node => setStatsInfo(node),
        setSearchbar: node => setSearchbar(node),
        setCta: node => setCta(node),
        setShowBack: flag => setShowBack(flag),
        setIsPageLoaded: flag => setIsPageLoaded(flag),
        resetPage,
        pageTitle,
        cta,
        sidebar,
        statsInfo,
        searchBar,
        showBack,
        isPageLoaded
      }}
    >
      {children}
    </MainLayoutContext.Provider>
  );
};

export default MainLayoutContext;
