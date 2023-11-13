import { ImageBackground, View } from "react-native";

import loading from "../assets/background/loading.png";
import { Footer } from "../components/footer/Footer";
import { Label } from "../components/label/Label";
import { useContentContext } from "../context/ContentProvider";

export const LoadingGame = () => {
  const { isMinimunWindowWidth } = useContentContext();
  return (
    <ImageBackground
      source={loading}
      resizeMode="stretch"
      style={{
        position: "absolute",
        zIndex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "flex-end",
      }}
    >
      <View
        // @ts-expect-error
        style={{
          flexWrap: "wrap",
          justifyContent: "flex-end",
          minHeight: "35em",
          flexGrow: 0,
          alignContent: "center",
        }}
      >
        <Label
          styleType="H1_Bebas_80"
          style={{ color: "#E8E1EF", textAlign: "center" }}
        >
          WIN OR NOT
        </Label>
        <Label
          styleType="H2_DHBS_80"
          style={{ color: "#2AF191", transform: [{ rotate: "-1.69deg" }] }}
        >
          we ARE TORIPUNKS
        </Label>
        <Label
          styleType="T1_Bebas_20"
          style={{ color: "#E8E1EF", textAlign: "center", marginTop: 10 }}
        >
          Be patient, the weapon is loading ...
        </Label>
        <View>
          <Footer isMinimunWindowWidth={isMinimunWindowWidth} />
        </View>
      </View>
    </ImageBackground>
  );
};
