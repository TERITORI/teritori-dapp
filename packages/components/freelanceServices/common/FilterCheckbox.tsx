import React, { useState } from "react";
import { View } from "react-native";
import { Switch } from "react-native-paper";

import { primaryColor } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";

export const FilterCheckbox = () => {
  const options = [
    {
      text: "Pro Services",
      checked: false,
    },
    {
      text: "Local Sellers",
      checked: false,
    },
    {
      text: "Online Sellers",
      checked: false,
    },
  ];
  const [option, setOption] = useState(options);

  return (
    <View style={{ flexDirection: "row", justifyContent: "center" }}>
      {option.map((item, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <Switch
            onValueChange={() => {
              option[index].checked = !option[index].checked;
              setOption([...option]);
            }}
            value={item.checked}
            color={primaryColor}
            style={{ width: 40, height: 24, marginRight: 10 }}
          />
          <BrandText style={fontSemibold14}>{item.text}</BrandText>
        </View>
      ))}
    </View>
  );
};
