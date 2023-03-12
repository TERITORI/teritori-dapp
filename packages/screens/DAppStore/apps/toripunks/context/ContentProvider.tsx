import { createContext, useContext, useState } from "react";

interface DefaultValue {
  setSelectedSectionHandler: (section: string) => void;
  selectedSection: string;
}

const defaultValue: DefaultValue = {
  setSelectedSectionHandler: () => {},
  selectedSection: "login",
};

const ContentContext = createContext(defaultValue);

export const ContentContextProvider: React.FC = ({ children }) => {
  const [selectedSection, setSelectedSection] = useState<string>("login");

  const setSelectedSectionHandler = (section: string) => {
    setSelectedSection(section);
  };

  return (
    <ContentContext.Provider
      value={{
        selectedSection,
        setSelectedSectionHandler,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContentContext = () => useContext(ContentContext);
