import { useFonts } from "expo-font";
import { View, ViewStyle } from "react-native";

import { Background } from "../components/background/Background";
import { MenuLink } from "../components/menu-link/MenuLink";
import { useContentContext } from "../context/ContentProvider";
import { Route } from "./Route";

export const Content = () => {
  const { selectedSection, isMinimunWindowWidth } = useContentContext();

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
        minHeight: "35em",
        flexGrow: 0,
      }
    : {
        flexWrap: "nowrap",
        justifyContent: "space-between",
        height: "auto",
        flexGrow: 1,
      };

  // Custom CSS (Layout) for different sections
  const customStyle = {
    main: { justifyContent: "flex-end", height: "auto" },
  };

  const validateCustomStyle = {
    get: (target: any, name: string) => {
      return target.hasOwnProperty(name) ? target[name] : {};
    },
  };

  const selectionStyle = new Proxy(customStyle, validateCustomStyle);

  return (
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
      </>
    </Background>
  );
};
