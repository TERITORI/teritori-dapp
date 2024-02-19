import React, { useState } from "react";
import { useWindowDimensions, View } from "react-native";

import CustomAppBar from "../../Mini/components/AppBar/CustomAppBar";
import MiniTextInput from "../../Mini/components/MiniTextInput";
import { AcceptAndNavigate } from "../layout/AcceptAndNavigate";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SpacerColumn } from "@/components/spacer";
import { ScreenFC } from "@/utils/navigation";
import { neutral77, neutralA3 } from "@/utils/style/colors";
import {
  fontMedium16,
  fontSemibold16,
  fontSemibold28,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const CreatePasswordWallet: ScreenFC<"CreatePasswordWallet"> = () => {
  const { width } = useWindowDimensions();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // special case user has password already

  return (
    <ScreenContainer
      responsive
      fullWidth
      footerChildren={null}
      noScroll
      headerMini={<CustomAppBar backEnabled />}
    >
      <View
        style={{
          flex: 1,
          width,
          justifyContent: "space-between",
          paddingHorizontal: layout.spacing_x2,
        }}
      >
        <View>
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
              buttonText="Save Password"
              label={
                <BrandText
                  style={[fontMedium16, { color: neutralA3, lineHeight: 22 }]}
                >
                  I agree to the{" "}
                  <BrandText
                    style={[
                      fontMedium16,
                      {
                        color: neutralA3,
                        lineHeight: 22,
                        textDecorationLine: "underline",
                      },
                    ]}
                  >
                    Terms of Service.
                  </BrandText>
                </BrandText>
              }
              value="terms&service"
              navigateTo="SuccessScreen"
            />
          )}
      </View>
    </ScreenContainer>
  );
};
