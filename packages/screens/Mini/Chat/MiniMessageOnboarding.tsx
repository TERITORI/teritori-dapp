import React, { useState } from "react";
import { View, useWindowDimensions } from "react-native";

import { CustomButton } from "../components/Button/CustomButton";

import addSVG from "@/assets/icons/add-new.svg";
import downloadSVG from "@/assets/icons/download-white.svg";
import messageSVG from "@/assets/icons/social/message.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useAppNavigation } from "@/utils/navigation";
import { neutral22, neutral88 } from "@/utils/style/colors";
import {
  fontSemibold14,
  fontSemibold16,
  fontSemibold30,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { handleRestoreAccount } from "@/weshnet/services";

export default function MiniMessageOnboarding() {
  const navigation = useAppNavigation();
  const { width } = useWindowDimensions();
  const { setToastError, setToastSuccess } = useFeedbacks();
  const [isImportAccountLoading, setIsImportAccountLoading] = useState(false);

  const handleImportAccount = async () => {
    setIsImportAccountLoading(true);
    try {
      await handleRestoreAccount();
      setToastSuccess({
        title: "Your account has been imported.",
        message: "It will take few short minutes to load the account.",
      });
    } catch {
      setToastError({
        title: "Import account failed.",
        message: "Failed to import account. Try again later.",
      });
    }
    setIsImportAccountLoading(false);
  };

  return (
    <ScreenContainer footerChildren={<></>} noMargin noScroll>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          width,
          paddingHorizontal: layout.spacing_x2,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            maxWidth: "70%",
            flex: 1,
          }}
        >
          <SVG height={148} width={148} source={messageSVG} />
          <SpacerColumn size={2} />
          <BrandText style={[fontSemibold30, { textAlign: "center" }]}>
            Welcome to Teritori messenger
          </BrandText>
        </View>

        <CustomButton
          onPress={handleImportAccount}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
          isDisabled={isImportAccountLoading}
        >
          <SVG height={16} width={16} source={downloadSVG} color="#fff" />
          <SpacerRow size={1} />
          <BrandText style={[fontSemibold16]}>Import Account</BrandText>
        </CustomButton>

        <SpacerColumn size={1.5} />
        <BrandText
          style={[
            fontSemibold14,
            {
              color: neutral88,
              backgroundColor: neutral22,
              textAlign: "center",
              alignSelf: "center",
              paddingHorizontal: layout.spacing_x1_5,
              paddingVertical: layout.spacing_x0_5,
              borderRadius: layout.borderRadius,
              overflow: "hidden",
            },
          ]}
        >
          OR
        </BrandText>
        <SpacerColumn size={1.5} />
        <CustomButton
          type="outline"
          onPress={() => navigation.navigate("MiniChatCreateAccount")}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SVG height={16} width={16} source={addSVG} color="#fff" />
          <SpacerRow size={1} />
          <BrandText style={[fontSemibold16]}>Create New Account</BrandText>
        </CustomButton>
      </View>
    </ScreenContainer>
  );
}
