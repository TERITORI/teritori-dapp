import { View } from "react-native";

import { Footer } from "../components/footer/Footer";
import { Label } from "../components/label/Label";
import { MenuLink } from "../components/menu-link/MenuLink";
import { useContentContext } from "../context/ContentProvider";

export const Welcome = () => {
  const { isMinimunWindowWidth } = useContentContext();

  const styleTypeSize = isMinimunWindowWidth ? "80" : "40";

  return (
    <>
      {!isMinimunWindowWidth && <MenuLink />}
      <View
        style={{
          justifyContent: "flex-end",
          marginTop: isMinimunWindowWidth ? "45vh" : 0,
        }}
      >
        <Label
          styleType={`H1_Bebas_${styleTypeSize}`}
          style={{ textAlign: "center", color: "#E8E1EF" }}
        >
          Hello PUNKS,
        </Label>
        <Label
          styleType={`H1_Bebas_${styleTypeSize}`}
          style={{ textAlign: "center", color: "#E8E1EF" }}
        >
          Welcome to the bar !
        </Label>
        <Label
          styleType={`H1_Bebas_${styleTypeSize}`}
          style={{ textAlign: "center", color: "#E8E1EF" }}
        >
          select your game
        </Label>
        {isMinimunWindowWidth && <MenuLink />}
        <Label
          styleType={`H2_DHBS_${styleTypeSize}`}
          style={{
            textAlign: "center",
            color: "#FFD753",
            transform: [{ rotate: "-1.69deg" }],
            marginTop: 54,
          }}
        >
          We are punks
        </Label>
        <Footer isMinimunWindowWidth={isMinimunWindowWidth} />
      </View>
    </>
  );
};
