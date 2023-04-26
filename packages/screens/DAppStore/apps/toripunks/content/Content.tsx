import { useFonts } from "expo-font";
import { View, ViewStyle } from "react-native";

import { LoadingGame } from "./Loading";
import { Route } from "./Route";
import { Background } from "../components/background/Background";
import { Footer } from "../components/footer/Footer";
import { MenuLink } from "../components/menu-link/MenuLink";
import { useContentContext } from "../context/ContentProvider";

export const Content = () => {
  const { selectedSection, isMinimunWindowWidth, loadingGame } =
    useContentContext();

  const [fontsLoaded] = useFonts({
    "Bebas Neue": require("../assets/font/Bebas_Neue/BebasNeue-Regular.ttf"),
    "Dafter Harder Better Stronger": require("../assets/font/Dafter_Harder_Better_Stronger/Dafter Harder Better Stronger.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  // CSS for Responsive WEB/Mobile
  const containerStyle = isMinimunWindowWidth
    ? {
        flexWrap: "wrap",
        justifyContent: "center",
        flexGrow: 0,
      }
    : {
        flexWrap: "nowrap",
        justifyContent: "space-between",
        flexGrow: 1,
      };

  // Custom CSS (Layout) for different sections
  const customStyle = {
    main: { justifyContent: "flex-end", height: "auto" },
    raffle: { justifyContent: "flex-end" },
    "menu-mobile": { justifyContent: "center" },
    roulette: { height: "56vh", marginTop: "6vh" },
  };

  const validateCustomStyle = {
    get: (target: any, name: string) => {
      return target.hasOwnProperty(name) ? target[name] : {};
    },
  };

  const selectionStyle = new Proxy(customStyle, validateCustomStyle);

  return (
    <>
      {loadingGame && <LoadingGame />}
      <Background type={selectedSection}>
        <>
          {selectedSection !== "welcome" && <MenuLink />}
          <View
            style={[
              containerStyle as ViewStyle,
              {
                flexDirection: "column",
                alignContent: "center",
              },
              selectionStyle[selectedSection] as ViewStyle,
            ]}
          >
            {Route(selectedSection)}
          </View>
          <View style={{ marginTop: isMinimunWindowWidth ? 78 : 40 }}>
            <Footer isMinimunWindowWidth={isMinimunWindowWidth} />
          </View>
        </>
      </Background>
    </>
  );
};
