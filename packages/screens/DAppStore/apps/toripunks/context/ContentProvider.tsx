import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Dimensions } from "react-native";

import { Wallet } from "../../../../../context/WalletsProvider";
import useSelectedWallet from "../../../../../hooks/useSelectedWallet";
import { useAppNavigation } from "../../../../../utils/navigation";
import { textStyle } from "./TextStyleUtil";

interface DefaultValue {
  setSelectedSectionHandler: (section: string) => void;
  selectedSection: string;
  styles: any;
  selectedWallet: Wallet | undefined;
  windowHeight: number;
  windowWidth: number;
  isMinimunWindowWidth: boolean;
  loadingGame: boolean;
  setLoadingGame: Dispatch<SetStateAction<boolean>>;
}

const defaultValue: DefaultValue = {
  setSelectedSectionHandler: () => {},
  selectedSection: "welcome",
  styles: {},
  selectedWallet: undefined,
  windowHeight: 800,
  windowWidth: 1024,
  isMinimunWindowWidth: false,
  loadingGame: true,
  setLoadingGame: () => {},
};

const windowDimensions = Dimensions.get("window");

const ContentContext = createContext(defaultValue);

export const ContentContextProvider: React.FC<{
  children: ReactNode;
  screen: string;
}> = ({ children, screen }) => {
  const [selectedSection, setSelectedSection] = useState<string>(screen);
  //RENAME salectedWallet after removing Dummy at Line 78
  const selectedWallet2 = useSelectedWallet();
  const navigation = useAppNavigation();
  const [loadingGame, setLoadingGame] = useState<boolean>(false);

  const setSelectedSectionHandler = (section: string) => {
    navigation.navigate("ToriPunks", { route: section });
    setSelectedSection(section);
  };

  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions({ window });
    });
    return () => subscription?.remove();
  });

  const { height: windowHeight, width: windowWidth } = dimensions.window;

  const isMinimunWindowWidth = windowWidth >= 1024;

  const styles = textStyle;

  //Replace dummy user.
  const selectedWallet = {
    address: "tori1xdtdctdedst45u8c8fmxutg8vvltyg5ezpdycz",
    connected: selectedWallet2?.connected,
    id: selectedWallet2?.id,
    networkId: selectedWallet2?.networkId,
    networkKind: selectedWallet2?.networkKind,
    provider: selectedWallet2?.provider,
    userId: selectedWallet2?.userId,
  } as Wallet;

  return (
    <ContentContext.Provider
      value={{
        selectedSection,
        setSelectedSectionHandler,
        styles,
        selectedWallet,
        windowHeight,
        windowWidth,
        isMinimunWindowWidth,
        loadingGame,
        setLoadingGame,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContentContext = () => useContext(ContentContext);
