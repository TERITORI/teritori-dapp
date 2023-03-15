import { useCallback } from "react";
import { View, Image, TouchableOpacity, Linking } from "react-native";

import { Label } from "../components/label/Label";
import { MenuLink } from "../components/menu-link/MenuLink";

const url = "https://www.aaa-metahuahua.com/";

export const Login = () => {
  const onPress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  }, []);

  return (
    <View style={{ justifyContent: "flex-end", marginTop: 100 }}>
      <Label
        styleType="H1_Bebas_80"
        style={{ textAlign: "center", color: "#E8E1EF" }}
      >
        Hello PUNKS,
      </Label>
      <Label
        styleType="H1_Bebas_80"
        style={{ textAlign: "center", color: "#E8E1EF" }}
      >
        Welcome to the bar !
      </Label>
      <Label
        styleType="H1_Bebas_80"
        style={{ textAlign: "center", color: "#E8E1EF" }}
      >
        select your game
      </Label>
      <MenuLink />
      <Label
        styleType="H2_DHBS_80"
        style={{
          textAlign: "center",
          color: "#FFD753",
          transform: [{ rotate: "-1.69deg" }],
          marginTop: 54,
        }}
      >
        We are punks
      </Label>
      <TouchableOpacity
        onPress={onPress}
        style={{
          margin: "auto",
          marginTop: 50,
          backgroundColor: "#212708",
        }}
      >
        <Image
          source={require("../assets/LOGO_REMIX.png")}
          fadeDuration={0}
          style={{
            width: 50,
            height: 50,
            tintColor: "#2AF191",
          }}
        />
      </TouchableOpacity>
    </View>
  );
};
