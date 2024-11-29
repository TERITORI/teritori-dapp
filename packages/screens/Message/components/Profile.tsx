import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import { Platform, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import QRCode from "react-native-qrcode-svg";
import { useSelector } from "react-redux";

import { Avatar } from "./Avatar";
import { EditProfile } from "./EditProfile";
import logoHexagonPNG from "../../../../assets/logos/logo-hexagon.png";
import { BrandText } from "../../../components/BrandText";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { selectContactInfo } from "../../../store/slices/message";
import { fontSemibold20 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

import Clipboard from "@/modules/Clipboard";
import { exportAccount } from "@/weshnet/services";

interface ProfileProps {
  onClose: () => void;
}

export const Profile = ({ onClose }: ProfileProps) => {
  const contactInfo = useSelector(selectContactInfo);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const isMobile = useIsMobile();
  const [isExportLoading, setIsExportLoading] = useState(false);
  const { setToastError, setToastSuccess } = useFeedbacks();

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(contactInfo.shareLink);

      setToastSuccess({
        title: "Contact link copied.",
        message: "",
      });
    } catch (err) {
      console.error("couldn't copy", err);
    }
  };
  const handleExport = async () => {
    setIsExportLoading(true);
    try {
      await exportAccount();
      if (Platform.OS === "web") {
        setToastSuccess({
          title: "Account backup has completed!",
          message: "Backup file has been downloaded on your device. ",
        });
      }
    } catch (err) {
      console.error("Account backup failed", err);
      setToastError({
        title: "Account backup failed!",
        message: "",
      });
    }
    setIsExportLoading(false);
  };

  const handleShare = () => {
    Sharing.shareAsync(contactInfo.shareLink);
  };

  return (
    <ModalBase
      label="My Profile"
      onClose={onClose}
      visible
      width={590}
      scrollable={isEditProfile}
    >
      <KeyboardAwareScrollView contentContainerStyle={{ alignItems: "center" }}>
        <Avatar source={contactInfo?.avatar} size={60} />
        <BrandText
          style={[
            fontSemibold20,
            {
              marginVertical: layout.spacing_x1,
            },
          ]}
        >
          {contactInfo?.name}
        </BrandText>
        <SpacerColumn size={2} />
        {isEditProfile ? (
          <EditProfile onClose={() => setIsEditProfile(false)} />
        ) : (
          <>
            {!!contactInfo.shareLink && (
              <QRCode
                size={220}
                value={contactInfo.shareLink}
                logo={logoHexagonPNG}
                logoSize={40}
                quietZone={8}
              />
            )}
            <SpacerColumn size={3} />
            <View
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <SecondaryButton
                onPress={() => setIsEditProfile(true)}
                text="Edit profile"
                size="SM"
              />
              {isMobile ? <SpacerColumn size={1} /> : <SpacerRow size={1} />}

              <SecondaryButton
                onPress={handleCopy}
                text="Copy account link"
                size="SM"
              />
              {Platform.OS !== "web" && (
                <>
                  <SpacerColumn size={1} />
                  <SecondaryButton
                    onPress={handleShare}
                    text="Share account link"
                    size="SM"
                  />
                </>
              )}
              {isMobile ? <SpacerColumn size={1} /> : <SpacerRow size={1} />}
              <SecondaryButton
                loader={isExportLoading}
                onPress={handleExport}
                text="Backup Account"
                size="SM"
              />
            </View>
          </>
        )}
        <SpacerColumn size={3} />
      </KeyboardAwareScrollView>
    </ModalBase>
  );
};
