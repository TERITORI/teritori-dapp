import { View } from "react-native";

import { Label } from "../components/label/Label";
import { MenuLink } from "../components/menu-link/MenuLink";

export const Login = () => {
  return (
    <View>
      <Label styleType="H1_80" style={{ textAlign: "center", color: "white" }}>
        Hello PUNKS,
      </Label>
      <Label styleType="H1_80" style={{ textAlign: "center", color: "white" }}>
        Welcome to the bar !
      </Label>
      <Label styleType="H1_80" style={{ textAlign: "center", color: "white" }}>
        select your game
      </Label>
      <MenuLink />
    </View>
  );
};
