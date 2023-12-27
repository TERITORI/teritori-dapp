import React, { useState } from "react";
import { View } from "react-native";
import { Checkbox } from "react-native-paper";

import { BrandText } from "../../../components/BrandText";
import { RouteName } from "../../../utils/navigation";
import {
  neutral15,
  neutral17,
  neutral44,
  neutralA3,
} from "../../../utils/style/colors";
import { fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { Button } from "../components/Button";

export const AcceptAndNavigate: React.FC<{
  buttonText: string;
  text: string;
  navigateTo: RouteName;
}> = ({ buttonText, text, navigateTo }) => {
  const [checked, setChecked] = useState(false);

  return (
    <View
      style={{
        width: "100%",
        flex: 2,

        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: "100%",
          height: 80,
          backgroundColor: neutral15,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          flexWrap: "nowrap",
          borderRadius: 10,
          gap: 12,
          paddingVertical: 8,
          paddingHorizontal: 16,
        }}
      >
        <View
          style={{
            borderRadius: 32,
            borderWidth: 1,
            borderColor: neutralA3,
            backgroundColor: neutral17,
          }}
        >
          <Checkbox
            status={checked ? "checked" : "unchecked"}
            onPress={() => {
              setChecked(!checked);
            }}
            color="#007AFF"
            uncheckedColor={neutral44}
          />
        </View>

        <BrandText style={[fontSemibold16]}>{text}</BrandText>
      </View>
      <View
        style={{
          width: "100%",
          marginTop: layout.spacing_x2,
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Button disabled={!checked} text={buttonText} navigateTo={navigateTo} />
      </View>
    </View>
  );
};
