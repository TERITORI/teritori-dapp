import React, { useState, useEffect } from "react";
import { Platform, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import QRCode from "react-native-qrcode-svg";
import { useDispatch, useSelector } from "react-redux";

import logoHexagonPNG from "../../../../assets/logos/logo-hexagon.png";
import { BrandText } from "../../../components/BrandText";
import { CopyToClipboard } from "../../../components/CopyToClipboard";
import { ErrorText } from "../../../components/ErrorText";
import { Separator } from "../../../components/Separator";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import ModalBase from "../../../components/modals/ModalBase";
import { QRCodeScannerModal } from "../../../components/modals/QRCodeScannerModal";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useIsMobile } from "../../../hooks/useIsMobile";
import {
  MessageState,
  selectContactInfo,
  setContactInfo,
} from "../../../store/slices/message";
import { neutral00, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { weshServices } from "../../../weshnet/client";
import { createSharableLink } from "../../../weshnet/client/services";
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

  const dispatch = useDispatch();

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
      setToastSuccess({
        title: "Request sent error",
        message: err?.message,
      });
    }

    setAddContactLoading(false);
  };

  const handleContactInfoChange = (
    key: keyof MessageState["contactInfo"],
    value: string
  ) => {
    dispatch(
      setContactInfo({
        [key]: value,
      })
    );
  };

  useEffect(() => {
    const shareLink = createSharableLink({
      ...contactInfo,
    });
    dispatch(
      setContactInfo({
        shareLink,
      })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleScan = async (link: string) => {
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
      width={580}
    >
      <KeyboardAwareScrollView>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <SpacerColumn size={2} />
          {!!contactInfo.shareLink && (
            <QRCode
              size={Platform.OS === "web" ? 200 : 180}
              value={contactInfo.shareLink}
              logo={logoHexagonPNG}
              logoSize={40}
            />
          )}
        </View>
        <SpacerColumn size={2} />
        {Platform.OS !== "web" && (
          <SecondaryButton
            text="Scan QR"
            size="M"
            onPress={() => setIsScan(true)}
          />
        )}
        <SpacerColumn size={2} />
        <BrandText
          style={[fontSemibold16, { marginBottom: layout.padding_x1 }]}
        >
          Name
        </BrandText>
        <View style={{ height: 50 }}>
          <TextInputCustom
            name="name"
            label=""
            placeHolder="Add name here"
            height={50}
            fullWidth
            onChangeText={(text) => handleContactInfoChange("name", text)}
            value={contactInfo.name}
            containerStyle={{
              flex: 1,
            }}
            placeholderTextColor={secondaryColor}
            squaresBackgroundColor={neutral00}
          />
        </View>
        <SpacerColumn size={2} />
        <BrandText
          style={[fontSemibold16, { marginBottom: layout.padding_x1 }]}
        >
          Avatar
        </BrandText>
        <View style={{ height: 50 }}>
          <TextInputCustom
            name="avatar"
            label=""
            placeHolder="Paste avatar URL here"
            height={50}
            fullWidth
            onChangeText={(text) => handleContactInfoChange("avatar", text)}
            value={contactInfo.avatar}
            containerStyle={{
              flex: 1,
            }}
            placeholderTextColor={secondaryColor}
            squaresBackgroundColor={neutral00}
          />
        </View>

        <SpacerColumn size={2} />
        <View>
          <BrandText
            style={[fontSemibold16, { marginBottom: layout.padding_x1 }]}
          >
            Share my contact
          </BrandText>
          <CopyToClipboard
            fullWidth
            containerStyle={{
              width: "100%",
            }}
            text={contactInfo.shareLink}
          />
        </View>
        <SpacerColumn size={3} />
        <Separator />
        <SpacerColumn size={3} />
        <View>
          <BrandText
            style={[fontSemibold16, { marginBottom: layout.padding_x1 }]}
          >
            Add contact
          </BrandText>
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              flex: 1,
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
          {!!error && (
            <>
              <SpacerColumn size={2} />
              <ErrorText>{error}</ErrorText>
            </>
          )}
          <SpacerColumn size={3} />
        </View>
      </KeyboardAwareScrollView>
    </ModalBase>
  );
};
