import React from "react";
import { TextInput, View } from "react-native";
import { useSelector } from "react-redux";

import { PrimaryButton } from "../../../../components/buttons/PrimaryButton";
import { selectIsLightTheme } from "../../../../store/slices/settings";

export const EstateCardViewProperty: React.FC = () => {
  const isLightTheme = useSelector(selectIsLightTheme);

  return (
    <PrimaryButton
      color="#3063D3"
      text="View Property"
      width={284}
      squaresBackgroundColor={isLightTheme ? "#FFFFFF" : "#000000"}
      style={{ flex: 1 }}
    />
  );
};

export const EstateCardWailistInput: React.FC = () => {
  const [value, onChangeValue] = React.useState<string>("");
  return (
    <View style={{ top: 3 }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <TextInput
          value={value}
          onChangeText={onChangeValue}
          style={{
            width: 150,
            flex: 1,
            padding: 10,
            color: "#000",
            borderWidth: 0.5,
            borderColor: "#A3A3A3",
            borderRadius: 10,
            fontSize: 12,
          }}
          placeholder="mail@teritori.com"
          placeholderTextColor="#A3A3A3"
        />
        <PrimaryButton
          color="#3063D3"
          text="Join the Waitlist"
          style={{ flex: 1, right: 18 }}
          noBrokenCorners
        />
      </View>
    </View>
  );
};
