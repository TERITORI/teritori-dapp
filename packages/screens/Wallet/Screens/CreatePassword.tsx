import React, { useState } from "react";
import { View, useWindowDimensions } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { SpacerColumn } from "../../../components/spacer";
import { ScreenFC } from "../../../utils/navigation";
import { neutral77 } from "../../../utils/style/colors";
import { fontSemibold16, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import MiniTextInput from "../../Mini/components/MiniTextInput";
import MultiStepScreenContainer from "../../Mini/layout/MultiStepScreenContainer";
import { AcceptAndNavigate } from "../layout/AcceptAndNavigate";

// This component has already been made in mini -> ledger -> components -> CreatePassword
export const CreatePassword: ScreenFC<"CreatePassword"> = () => {
  const { width } = useWindowDimensions();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <MultiStepScreenContainer screenPercentage={50} enableBack>
      <View
        style={{
          flex: 1,
          width,
          justifyContent: "space-between",
          paddingHorizontal: layout.spacing_x2,
        }}
      >
        <View>
          <SpacerColumn size={8} />
          <BrandText
            style={[fontSemibold28, { marginBottom: layout.spacing_x1_5 }]}
          >
            Create a Password
          </BrandText>
          <BrandText
            style={[
              fontSemibold16,
              { color: neutral77, marginBottom: layout.spacing_x3 },
            ]}
          >
            This will be used to unlock your wallet.
          </BrandText>

          <MiniTextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            autoComplete="off"
            autoCapitalize="none"
            secureTextEntry
          />

          <SpacerColumn size={1.5} />

          <MiniTextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm Password"
            autoComplete="off"
            autoCapitalize="none"
            secureTextEntry
          />
        </View>
        {password === confirmPassword &&
          password.length > 0 &&
          confirmPassword.length > 0 && (
            <AcceptAndNavigate
              buttonText="Save"
              label="I agree to the Terms of Service."
              value="terms&service"
              navigateTo="SuccessScreen"
            />
          )}
      </View>
    </MultiStepScreenContainer>
  );
};
