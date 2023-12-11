import * as Clipboard from "expo-clipboard";
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

interface ProfileProps {
  onClose: () => void;
}

export const Profile = ({ onClose }: ProfileProps) => {
  const contactInfo = useSelector(selectContactInfo);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const isMobile = useIsMobile();

  const { setToastSuccess } = useFeedbacks();

  const handleCopy = () => {
    Clipboard.setStringAsync(contactInfo.shareLink);
    setToastSuccess({
      title: "Contact link copied.",
      message: "",
    });
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
        <SpacerColumn size={2} />
        <Avatar source={contactInfo?.avatar} size={100} />
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
                size={Platform.OS === "web" ? 220 : 140}
                value={contactInfo.shareLink}
                logo={logoHexagonPNG}
                logoSize={40}
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
                text="Edit Profile"
                size="SM"
              />
              {isMobile ? <SpacerColumn size={1} /> : <SpacerRow size={1} />}

              <SecondaryButton
                onPress={handleCopy}
                text="Copy Link"
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
