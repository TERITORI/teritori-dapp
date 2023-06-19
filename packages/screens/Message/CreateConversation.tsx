import React, { useState } from "react";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

import logoHexagonPNG from "../../../assets/logos/logo-hexagon.png";
import { BrandText } from "../../components/BrandText";
import { CopyToClipboard } from "../../components/CopyToClipboard";
import { ErrorText } from "../../components/ErrorText";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";
import ModalBase from "../../components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { neutral00, secondaryColor } from "../../utils/style/colors";
import { fontSemibold16 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { weshClient, weshConfig, weshServices } from "../../weshnet/client";

interface CreateConversationProps {
  onClose: () => void;
}

export const CreateConversation = ({ onClose }: CreateConversationProps) => {
  const [contactLink, setContactLink] = useState("");
  const [addContactLoading, setAddContactLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedWallet = useSelectedWallet();
  const userInfo = useNSUserInfo(selectedWallet?.userId);

  const handleAddContact = async () => {
    setAddContactLoading(true);
    setError("");

    try {
      await weshServices.addContact(contactLink, userInfo?.metadata?.tokenId);
      onClose();
    } catch (err) {
      setError(err?.message);
    }

    setAddContactLoading(false);
  };

  return (
    <ModalBase
      label="Create conversation"
      onClose={onClose}
      visible
      width={580}
    >
      <SpacerColumn size={2} />
      <View
        style={{
          alignItems: "center",
        }}
      >
        {!!weshConfig.shareLink && (
          <QRCode
            size={200}
            value={weshConfig.shareLink}
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
          text={weshConfig?.shareLink}
        />
      </View>
      <SpacerColumn size={2} />
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
