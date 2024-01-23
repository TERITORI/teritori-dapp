import React, { useState } from "react";
import { View, ViewStyle, useWindowDimensions } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { ProgressLine } from "../../../components/ProgressLine";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn } from "../../../components/spacer";
import { Metadata } from "../../../contracts-clients/teritori-name-service/TeritoriNameService.types";
import { ScreenFC } from "../../../utils/navigation";
import { neutral00, neutral77 } from "../../../utils/style/colors";
import { fontSemibold16, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import CustomAppBar from "../../Mini/components/AppBar/CustomAppBar";
import { AcceptAndNavigate } from "../layout/AcceptAndNavigate";

// This component has already been made in mini -> ledger -> components -> CreatePassword
export const CreatePassword: ScreenFC<"CreatePassword"> = () => {
  const { width } = useWindowDimensions();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const inputStyle: ViewStyle = { marginBottom: 12, width: "100%" };

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
          <ProgressLine percent={75} width={width} style={{ width: "100%" }} />

          <SpacerColumn size={5.6} />

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

          <TextInputCustom<Metadata>
            name="password"
            style={inputStyle}
            label="Password"
            placeHolder="Password"
            value={password}
            textContentType="newPassword"
            autoComplete="off"
            onChangeText={setPassword}
            squaresBackgroundColor={neutral00}
          />
          <TextInputCustom<Metadata>
            name="confirm-password"
            style={inputStyle}
            label="Password"
            placeHolder="Confirm Password"
            value={confirmPassword}
            textContentType="newPassword"
            autoComplete="off"
            autoCapitalize="none"
            onChangeText={setConfirmPassword}
            squaresBackgroundColor={neutral00}
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
    </ScreenContainer>
  );
};
