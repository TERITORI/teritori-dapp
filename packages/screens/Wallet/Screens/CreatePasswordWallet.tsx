import React, { useEffect, useState } from "react";
import { useWindowDimensions, View } from "react-native";

import CustomAppBar from "../../Mini/components/AppBar/CustomAppBar";
import MiniTextInput from "../../Mini/components/MiniTextInput";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SpacerColumn } from "@/components/spacer";
import { getValueFor, save } from "@/hooks/useMobileSecureStore";
import { CustomButton } from "@/screens/Mini/components/Button/CustomButton";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import { neutral77 } from "@/utils/style/colors";
import { fontSemibold16, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const CreatePasswordWallet: ScreenFC<"CreatePasswordWallet"> = () => {
  const { width } = useWindowDimensions();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useAppNavigation();

  // special case user has password already

  useEffect(() => {
    (async () => {
      const hasPassword = await getValueFor("password");
      if (hasPassword) {
        navigation.navigate("SuccessScreen");
      }
    })();
  }, [navigation]);

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

        <CustomButton
          onPress={(_, navigation) => {
            save("password", password)
              .then(() => {
                navigation.navigate("SuccessScreen");
              })
              .catch((e) => {
                console.error(e);
              });
          }}
          textStyle={{ textTransform: "uppercase" }}
          title="Save Password"
          isDisabled={
            password !== confirmPassword &&
            password.length > 0 &&
            confirmPassword.length > 0
          }
        />
      </View>
    </ScreenContainer>
  );
};
