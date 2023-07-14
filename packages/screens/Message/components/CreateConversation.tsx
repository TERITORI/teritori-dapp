import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useDispatch, useSelector } from "react-redux";

import logoHexagonPNG from "../../../../assets/logos/logo-hexagon.png";
import { BrandText } from "../../../components/BrandText";
import { CopyToClipboard } from "../../../components/CopyToClipboard";
import { ErrorText } from "../../../components/ErrorText";
import { Separator } from "../../../components/Separator";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import {
  MessageState,
  selectContactInfo,
  setContactInfo,
} from "../../../store/slices/message";
import { neutral00, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { weshClient, weshConfig, weshServices } from "../../../weshnet/client";
import { createSharableLink } from "../../../weshnet/client/services";
interface CreateConversationProps {
  onClose: () => void;
}

export const CreateConversation = ({ onClose }: CreateConversationProps) => {
  const contactInfo = useSelector(selectContactInfo);
  const [contactLink, setContactLink] = useState("");
  const [addContactLoading, setAddContactLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const selectedWallet = useSelectedWallet();
  const userInfo = useNSUserInfo(selectedWallet?.userId);

  const handleAddContact = async () => {
    setAddContactLoading(true);
    setError("");

    try {
      await weshServices.addContact(contactLink, contactInfo);
      onClose();
    } catch (err) {
      setError(err?.message);
    }

    setAddContactLoading(false);
  };

  const handleContactInfoChange = (
    key: keyof MessageState["contactInfo"],
    value: string
  ) => {
    const shareLink = createSharableLink({
      ...contactInfo,
      [key]: value,
    });
    dispatch(
      setContactInfo({
        [key]: value,
        shareLink,
      })
    );
  };

  return (
    <ModalBase
      label="Create conversation"
      onClose={onClose}
      visible
      width={580}
    >
      <SpacerColumn size={2} />

      <BrandText style={[fontSemibold16, { marginBottom: layout.padding_x1 }]}>
        Name
      </BrandText>

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
      <SpacerColumn size={2} />
      <BrandText style={[fontSemibold16, { marginBottom: layout.padding_x1 }]}>
        Avatar
      </BrandText>

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

      <View
        style={{
          alignItems: "center",
        }}
      >
        <SpacerColumn size={2} />
        {!!contactInfo.shareLink && (
          <QRCode
            size={200}
            value={contactInfo.shareLink}
            logo={logoHexagonPNG}
            logoSize={40}
          />
        )}
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
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
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
          <SpacerRow size={2} />
          <PrimaryButton
            loader
            isLoading={addContactLoading}
            size="M"
            text="Add"
            onPress={handleAddContact}
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
    </ModalBase>
  );
};
