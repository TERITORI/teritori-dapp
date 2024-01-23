import React, { useState } from "react";
import { StyleProp, TextInput, TextStyle, View } from "react-native";

import { PrimaryButton } from "../../../../components/buttons/PrimaryButton";
import { useIsMobile } from "../../../../hooks/useIsMobile";
import { useTheme } from "../../../../hooks/useTheme";
import { neutralA3 } from "../../../../utils/style/colors";

export const EstateCardViewProperty: React.FC = () => {
  const theme = useTheme();

  return (
    <PrimaryButton
      color={theme.primaryButtonColor}
      text="View Property"
      fullWidth
    />
  );
};

export const EstateCardWailistInput: React.FC = () => {
  const [value, onChangeValue] = useState<string>("");
  const theme = useTheme();
  const isMobile = useIsMobile();

  return (
    <View style={{ top: 3 }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <TextInput
          value={value}
          onChangeText={onChangeValue}
          style={[
            TextInputCStyle,
            {
              flex: 1,
              color: theme.textColor,
              borderColor: theme.borderColor,
            },
          ]}
          placeholder="mail@teritori.com"
          placeholderTextColor={neutralA3}
        />
        <View style={{ flex: 1 }}>
          <PrimaryButton
            fullWidth
            color={theme.primaryButtonColor}
            text={isMobile ? "Join..." : "Join Waitlist"}
          />
        </View>
      </View>
    </View>
  );
};

const TextInputCStyle: StyleProp<TextStyle> = {
  padding: 10,
  borderWidth: 1,
  borderRadius: 6,
  fontSize: 12,
};
