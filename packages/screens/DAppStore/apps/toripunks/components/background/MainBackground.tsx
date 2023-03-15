// deprecated.
import { ImageBackground, View } from "react-native";

import main from "../../assets/background/main.png";

export const MainBackground: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  return (
    <>
      <ImageBackground
        source={main}
        resizeMode="contain"
        style={{
          flex: 1,
          position: "absolute",
          height: "100%",
          width: "100%",
          left: "-70%",
          zIndex: 1,
        }}
      />
      <View
        style={{
          backgroundColor: "rgb(25,14,17)",
          height: "100%",
          width: "100%",
        }}
      >
        {children}
      </View>
      <ImageBackground
        source={main}
        resizeMode="contain"
        style={{
          flex: 1,
          position: "absolute",
          height: "40%",
          width: "70%",
          left: "65%",
          bottom: 0,
          zIndex: 1,
        }}
        imageStyle={{
          height: "100%",
          width: "100%",
        }}
      />
    </>
  );
};
