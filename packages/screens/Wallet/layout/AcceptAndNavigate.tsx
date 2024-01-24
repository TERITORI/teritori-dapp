import React, { ReactNode, useState } from "react";
import { View } from "react-native";

import { RouteName } from "../../../utils/navigation";
import { neutral22, neutralA3 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { CustomButton } from "../../Mini/components/Button/CustomButton";
import Checkbox from "../../Mini/components/Checkbox/Checkbox";

export const AcceptAndNavigate: React.FC<{
  buttonText: string;
  label: string | ReactNode;
  value: string;
  navigateTo: RouteName;
}> = ({ buttonText, label, value, navigateTo }) => {
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
      <Checkbox
        type="circle"
        isChecked={checked}
        onPress={(isChecked, _) => setChecked(!isChecked)}
        label={label}
        value={value}
        size="md"
        labelStyle={[{ color: neutralA3, lineHeight: 22, flex: 1 }]}
        wrapperStyle={{
          alignItems: "center",
          borderRadius: layout.borderRadius,
          backgroundColor: neutral22,
          paddingVertical: layout.spacing_x1,
          paddingHorizontal: layout.spacing_x2,
        }}
      />
      <View
        style={{
          width: "100%",
          marginTop: layout.spacing_x2,
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <CustomButton
          isDisabled={!checked}
          title={buttonText}
          textStyle={{ textTransform: "uppercase" }}
          onPress={(_, navigation) => navigation.replace(navigateTo)}
        />
      </View>
    </View>
  );
};
