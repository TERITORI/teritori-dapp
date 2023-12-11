import React, { useState } from "react";
import { Platform, View } from "react-native";
import { useSelector } from "react-redux";

import { BrandText } from "../../../components/BrandText";
import { ErrorText } from "../../../components/ErrorText";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import ModalBase from "../../../components/modals/ModalBase";
import { QRCodeScannerModal } from "../../../components/modals/QRCodeScannerModal";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { selectContactInfo } from "../../../store/slices/message";
import {
  neutral00,
  neutral22,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { weshServices } from "../../../weshnet";

interface CreateConversationProps {
  onClose: () => void;
}

export const CreateConversation = ({ onClose }: CreateConversationProps) => {
  const contactInfo = useSelector(selectContactInfo);
  const { setToastSuccess, setToastError } = useFeedbacks();
  const [contactLink, setContactLink] = useState("");
  const [addContactLoading, setAddContactLoading] = useState(false);
  const [error, setError] = useState("");
  const [isScan, setIsScan] = useState(false);
  const isMobile = useIsMobile();

  const handleAddContact = async (link = contactLink) => {
    setAddContactLoading(true);
    setError("");

    try {
      await weshServices.addContact(link, contactInfo);
      setToastSuccess({
        title: "Request sent",
        message: "Contact Request sent successfully",
      });
      onClose();
    } catch (err: any) {
      setError(err?.message);
      setToastError({
        title: "Request sent error",
        message: err?.message,
      });
    }

    setAddContactLoading(false);
  };

  const handleScan = async (link?: string) => {
    if (link) {
      await handleAddContact(link);
      onClose();
    } else {
      setIsScan(false);
    }
  };

  if (isScan) {
    return <QRCodeScannerModal onClose={handleScan} />;
  }

  return (
    <ModalBase
      label="Create conversation"
      onClose={onClose}
      visible
      width={590}
    >
      <SpacerColumn size={3} />
      <View>
        <BrandText
          style={[fontSemibold16, { marginBottom: layout.spacing_x1 }]}
        >
          Add contact
        </BrandText>
        <View
          style={{
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ height: 50, width: isMobile ? "100%" : 460 }}>
            <TextInputCustom
              name="contactLink"
              label=""
              placeHolder="Paste the contact link here"
              height={50}
              fullWidth
              onChangeText={setContactLink}
              value={contactLink}
              containerStyle={{
                flex: 1,
              }}
              placeholderTextColor={secondaryColor}
              squaresBackgroundColor={neutral00}
            />
          </View>
          <SpacerRow size={2} />
          {isMobile && <SpacerColumn size={2} />}
          <PrimaryButton
            loader
            isLoading={addContactLoading}
            size="M"
            text="Add"
            onPress={handleAddContact}
            fullWidth={isMobile}
          />
        </View>

        {Platform.OS !== "web" && (
          <View>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginVertical: layout.spacing_x1_5,
              }}
            >
              <BrandText
                style={[
                  fontSemibold13,
                  { color: neutralA3, zIndex: 2, backgroundColor: neutral00 },
                ]}
              >
                OR
              </BrandText>
              <View
                style={{
                  height: 1,
                  backgroundColor: neutral22,
                  position: "absolute",
                  top: 8,
                  width: "100%",
                }}
              />
            </View>
            <SecondaryButton
              text="Scan QR"
              size="M"
              onPress={() => setIsScan(true)}
              touchableStyle={{
                alignSelf: "center",
              }}
            />
          </View>
        )}

        {!!error && (
          <>
            <SpacerColumn size={2} />
            <ErrorText>{error}</ErrorText>
          </>
        )}
        <SpacerColumn size={3} />
      </View>
    </ModalBase>
  );
};
