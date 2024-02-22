import React, { useState } from "react";
import { View } from "react-native";

import { EditProfile } from "./EditProfile";
import addSVG from "../../../../assets/icons/add.svg";
import downloadSVG from "../../../../assets/icons/download.svg";
import illustrationSVG from "../../../../assets/illustrations/message-onboarding.svg";
import { BrandText } from "../../../components/BrandText";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { neutral77 } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import {
  handleRestoreAccount,
  setMessageOnboardingComplete,
} from "../../../weshnet/services";

import { SVG } from "@/components/SVG";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { PrimaryButtonOutline } from "@/components/buttons/PrimaryButtonOutline";
import ModalBase from "@/components/modals/ModalBase";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useMaxResolution } from "@/hooks/useMaxResolution";

export const MessageOnboarding = () => {
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const { height, width } = useMaxResolution();
  const isMobile = useIsMobile();
  const { setToastError, setToastSuccess } = useFeedbacks();
  const [isImportAccountLoading, setIsImportAccountLoading] = useState(false);

  const handleAccountCreation = async () => {
    await setMessageOnboardingComplete();
  };
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
          position: "relative",
          flex: 1,
          overflow: "hidden",
          width,
        }}
      >
        {!isMobile && (
          <SVG
            height={height + 200}
            width={height + 200}
            source={illustrationSVG}
            style={{
              position: "absolute",
            }}
          />
        )}
        <View>
          <View
            style={{
              marginBottom: layout.spacing_x4,
              alignSelf: "center",
            }}
          >
            <BrandText style={[fontSemibold20]}>
              Welcome to Teritori messenger
            </BrandText>
          </View>

          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
            }}
          >
            <PrimaryButton
              iconSVG={downloadSVG}
              size="SM"
              text="Import Account"
              onPress={handleImportAccount}
              loader={isImportAccountLoading}
              width={200}
            />
            <BrandText
              style={[
                fontSemibold14,
                { color: neutral77, margin: layout.spacing_x2 },
              ]}
            >
              or
            </BrandText>
            <PrimaryButtonOutline
              style={{
                borderRadius: 100,
              }}
              size="SM"
              iconSVG={addSVG}
              text="Create New Account"
              onPress={() => setIsCreateAccount(true)}
              width={200}
            />
          </View>
        </View>
      </View>
      {isCreateAccount && (
        <ModalBase
          width={400}
          onClose={() => setIsCreateAccount(false)}
          label="Create Account"
        >
          <View
            style={{
              paddingBottom: layout.spacing_x3,
            }}
          >
            <EditProfile
              onClose={handleAccountCreation}
              buttonTitle="Create Account"
            />
          </View>
        </ModalBase>
      )}
    </ScreenContainer>
  );
};
