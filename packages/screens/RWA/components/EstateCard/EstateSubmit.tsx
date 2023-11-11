import React from "react";
import { TextInput, View } from "react-native";

import { PrimaryButton } from "../../../../components/buttons/PrimaryButton";
import { useTheme } from "../../../../hooks/useTheme";
import { neutralA3 } from "../../../../utils/style/colors";

export const EstateCardViewProperty: React.FC = () => {
  const theme = useTheme();

  return (
    <PrimaryButton
      color={theme.primaryButtonColor}
      text="View Property"
      width={284}
      squaresBackgroundColor={theme.backgroundColor}
      style={{ flex: 1 }}
    />
  );
};

export const EstateCardWailistInput: React.FC = () => {
  const [value, onChangeValue] = React.useState<string>("");
  const theme = useTheme();

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
            color: theme.textColor,
            borderWidth: 1,
            borderColor: theme.borderColor,
            borderRadius: 10,
            fontSize: 12,
          }}
          placeholder="mail@teritori.com"
          placeholderTextColor={neutralA3}
        />
        <PrimaryButton
          color={theme.primaryButtonColor}
          text="Join the Waitlist"
          style={{ flex: 1, right: 18 }}
          noBrokenCorners
        />
      </View>
    </View>
  );
};
