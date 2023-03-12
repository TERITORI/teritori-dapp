import { View } from "react-native";

import { Background } from "../components/background/Background";
import { Label } from "../components/label/Label";
import { MenuLink } from "../components/menu-link/MenuLink";
import { useContentContext } from "../context/ContentProvider";

export const Content = () => {
  const { selectedSection } = useContentContext();

  return (
    <Background type={selectedSection}>
      <View
        style={{
          flexDirection: "column",
          flexWrap: "wrap",
          justifyContent: "center",
          alignContent: "center",
          height: "35em",
        }}
      >
        <Label styleType="H1_80">ToriPunks Placeholder</Label>
        <MenuLink />
      </View>
    </Background>
  );
};
