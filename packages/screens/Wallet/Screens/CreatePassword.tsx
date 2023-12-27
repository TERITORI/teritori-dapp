import React, { useState } from "react";
import { View, ViewStyle } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { Metadata } from "../../../contracts-clients/teritori-name-service/TeritoriNameService.types";
import { ScreenFC } from "../../../utils/navigation";
import { neutral00, neutral77 } from "../../../utils/style/colors";
import { fontSemibold16, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { AcceptAndNavigate } from "../layout/AcceptAndNavigate";
import { TopBarWithProgress } from "../layout/TopBarWithProgress";
import { WalletContainer } from "../layout/WalletContainer";

export const CreatePassword: ScreenFC<"CreatePassword"> = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const inputStyle: ViewStyle = { marginBottom: 12, width: "100%" };

  return (
    <WalletContainer>
      <TopBarWithProgress progress={50} />
      <View
        style={{
          width: "100%",
          flex: 7,
          marginTop: layout.spacing_x3,
          alignItems: "flex-start",
        }}
      >
        <BrandText style={[fontSemibold28]}>Create a Password</BrandText>
        <BrandText
          style={[
            fontSemibold16,
            { color: neutral77, marginTop: layout.spacing_x1 },
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
          onChangeText={setPassword}
          squaresBackgroundColor={neutral00}
        />
        <TextInputCustom<Metadata>
          name="password"
          style={inputStyle}
          label="Password"
          placeHolder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          squaresBackgroundColor={neutral00}
        />
      </View>
      {password === confirmPassword &&
        password.length > 0 &&
        confirmPassword.length > 0 && (
          <AcceptAndNavigate
            buttonText="Save"
            text="I agree to the Terms of Service."
            navigateTo="SuccessScreen"
          />
        )}
    </WalletContainer>
  );
};
