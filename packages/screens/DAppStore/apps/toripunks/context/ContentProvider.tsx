import { createContext, useContext, useState } from "react";
import { StyleSheet } from "react-native";

interface DefaultValue {
  setSelectedSectionHandler: (section: string) => void;
  selectedSection: string;
  styles: any;
}

const defaultValue: DefaultValue = {
  setSelectedSectionHandler: () => {},
  selectedSection: "login",
  styles: StyleSheet.create({}),
};

const ContentContext = createContext(defaultValue);

export const ContentContextProvider: React.FC = ({ children }) => {
  const [selectedSection, setSelectedSection] = useState<string>("login");

  const setSelectedSectionHandler = (section: string) => {
    setSelectedSection(section);
  };

  const styles = StyleSheet.create({
    base: {
      color: "white",
      fontSize: 20,
      fontWeight: "600",
    },
    H1_Bebas_80: {
      fontFamily: "Bebas Neue",
      fontStyle: "normal",
      fontWeight: "400",
      fontSize: 80,
      lineHeight: 96,
    },
    H1_Bebas_40: {
      fontFamily: "Bebas Neue",
      fontStyle: "normal",
      fontWeight: "400",
      fontSize: 40,
      lineHeight: 96,
    },
    H2_DHBS_80: {
      fontFamily: "Dafter Harder Better Stronger",
      fontStyle: "normal",
      fontWeight: "400",
      fontSize: 80,
      lineHeight: 96,
    },
    H2_DHBS_40: {
      fontFamily: "Dafter Harder Better Stronger",
      fontStyle: "normal",
      fontWeight: "400",
      fontSize: 40,
      lineHeight: 96,
    },
    T2_Bebas_50: {
      fontFamily: "Bebas Neue",
      fontStyle: "normal",
      fontWeight: "400",
      fontSize: 50,
      lineHeight: 96,
    },
    T2_Bebas_20: {
      fontFamily: "Bebas Neue",
      fontStyle: "normal",
      fontWeight: "400",
      fontSize: 20,
      lineHeight: 96,
    },
    T1_Bebas_20: {
      fontFamily: "Bebas Neue",
      fontStyle: "normal",
      fontWeight: "400",
      fontSize: 20,
      lineHeight: 96,
    },
    T1_DHBS_20: {
      fontFamily: "Dafter Harder Better Stronger",
      fontStyle: "normal",
      fontWeight: "400",
      fontSize: 20,
      lineHeight: 96,
    },
    T1_Bebas_15: {
      fontFamily: "Bebas Neue",
      fontStyle: "normal",
      fontWeight: "400",
      fontSize: 15,
      lineHeight: 96,
    },
  });

  return (
    <ContentContext.Provider
      value={{
        selectedSection,
        setSelectedSectionHandler,
        styles,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContentContext = () => useContext(ContentContext);
