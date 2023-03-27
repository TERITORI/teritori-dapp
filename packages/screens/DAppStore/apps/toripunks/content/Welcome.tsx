import { View } from "react-native";

import { Label } from "../components/label/Label";
import { MenuLink } from "../components/menu-link/MenuLink";
import { useContentContext } from "../context/ContentProvider";

export const Welcome = () => {
  const { isMinimunWindowWidth } = useContentContext();

  const styleTypeSize = isMinimunWindowWidth ? "80" : "40";

  return (
    <View
      style={{
        height: "74vh",
        justifyContent: isMinimunWindowWidth ? "flex-end" : "space-between",
      }}
    >
      {!isMinimunWindowWidth && <MenuLink />}
      <View>
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
      </View>
    </View>
  );
};
