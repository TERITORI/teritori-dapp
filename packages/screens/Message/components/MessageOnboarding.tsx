import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { View } from "react-native";

import { EditProfile } from "./EditProfile";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { readFileAsBase64 } from "../../../utils/file";
import { neutral67, neutral77 } from "../../../utils/style/colors";
import { fontMedium13, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { getWeshnetAddress, weshClient } from "../../../weshnet/client";
import { exportAccount } from "../../../weshnet/services";

interface CreateGroupProps {}

export const MessageOnboarding = (props: CreateGroupProps) => {
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const { setToastSuccess } = useFeedbacks();

  const handleCreateAccount = async () => {
    exportAccount();
    setToastSuccess({
      title: "Account created.",
      message:
        "You account data has been exported automatically, you can import it later on another device",
    });
  };

  const handleImportAccount = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/x-tar",
    });

    if (!result.canceled && result.assets[0]) {
      console.log(result.assets[0]);
      const base64String = await readFileAsBase64(result.assets[0].file);
      try {
        console.log("address", getWeshnetAddress(weshClient.port));
        const response = await axios.post(
          `${getWeshnetAddress(weshClient.port)}/import-account`,
          base64String,
        );

        console.log("Account imported successfully:", response.data);
      } catch (error) {
        console.error("Failed to import account:", error);
      }
    }
  };
  return (
    <ScreenContainer
      headerChildren={<></>}
      responsive
      footerChildren={
        <View
          style={{
            marginVertical: layout.spacing_x1,
          }}
        >
          <BrandText
            style={[fontMedium13, { textAlign: "center", color: neutral77 }]}
          >
            Powered by weshnet
          </BrandText>
        </View>
      }
      noScroll
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingTop: layout.spacing_x2,
        }}
      >
        <View>
          <View
            style={{
              marginBottom: layout.spacing_x4,
              alignSelf: "center",
            }}
          >
            <BrandText>Welcome to Teritori messenger</BrandText>
          </View>

          {isCreateAccount ? (
            <View>
              <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                Create Account
              </BrandText>
              <EditProfile
                onClose={() => handleCreateAccount()}
                buttonTitle="Create Account"
              />
            </View>
          ) : (
            <FlexRow>
              <SecondaryButton
                style={{
                  height: 180,
                  width: 240,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                size="M"
                text="Import Account"
                onPress={handleImportAccount}
              />
              <LinearGradient
                style={{
                  height: 100,
                  width: 2,
                  marginHorizontal: layout.spacing_x4,
                  transform: "rotate(10deg)",
                }}
                colors={["#01B7C5", "#782C96"]}
              />

              <SecondaryButton
                size="M"
                style={{
                  height: 180,
                  width: 240,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                text="Create New Account"
                onPress={() => setIsCreateAccount(true)}
              />
            </FlexRow>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
};
