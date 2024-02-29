import React, { useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import { CustomButton } from "../components/Button/CustomButton";
import MiniTextInput from "../components/MiniTextInput";
import { ScanQRToSendRequest } from "../components/ScanQRToSendRequest";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import addSVG from "@/assets/icons/add-new.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { selectContactInfo } from "@/store/slices/message";
import { ScreenFC } from "@/utils/navigation";
import {
  neutral22,
  neutralA3,
  redDefault,
  secondaryColor,
  successColor,
  withAlpha,
} from "@/utils/style/colors";
import {
  fontMedium14,
  fontSemibold14,
  fontSemibold15,
  fontSemibold30,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { weshServices } from "@/weshnet";

export const MiniAddFriendScreen: ScreenFC<"MiniAddFriend"> = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addContactLoading, setAddContactLoading] = useState(false);
  const [contactLink, setContactLink] = useState("");
  const contactInfo = useSelector(selectContactInfo);

  const handleAddContact = async () => {
    setAddContactLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!contactLink) {
        setError("Please provide the link.");
        setAddContactLoading(false);
        return;
      }

      await weshServices.addContact(contactLink, contactInfo);
      setContactLink("");
      setSuccess("Successfully Added!");
    } catch (err: any) {
      console.log(err);
      setError("Failed to add contact.");
    }

    setAddContactLoading(false);
  };

  return (
    <BlurScreenContainer>
      <View style={{ paddingHorizontal: layout.spacing_x2, flex: 1 }}>
        <SpacerColumn size={1} />
        <BrandText style={[fontSemibold30]}>Add contact</BrandText>
        <SpacerColumn size={2} />

        <MiniTextInput
          placeholder="Paste the contact link here"
          style={{ backgroundColor: withAlpha(neutral22, 0.9) }}
          placeholderTextColor={neutralA3}
          value={contactLink}
          onChangeText={setContactLink}
        />
        <SpacerColumn size={2} />
        {error && (
          <BrandText
            style={[
              fontMedium14,
              {
                marginBottom: layout.spacing_x1,
                color: redDefault,
              },
            ]}
          >
            {error}
          </BrandText>
        )}

        {success && (
          <BrandText
            style={[
              fontMedium14,
              {
                marginBottom: layout.spacing_x1,
                color: successColor,
              },
            ]}
          >
            {success}
          </BrandText>
        )}
        <View
          style={{
            flex: 1,
          }}
        />

        <CustomButton
          onPress={handleAddContact}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
          isDisabled={addContactLoading}
        >
          <SVG height={16} width={16} source={addSVG} color="#fff" />
          <SpacerRow size={1} />
          <BrandText style={[fontSemibold15, { lineHeight: 0 }]}>Add</BrandText>
        </CustomButton>

        <SpacerColumn size={1.5} />
        <BrandText
          style={[
            fontSemibold14,
            {
              color: secondaryColor,
              backgroundColor: neutral22,
              textAlign: "center",
              alignSelf: "center",
              paddingHorizontal: layout.spacing_x1,
              paddingVertical: layout.spacing_x0_75,
              borderRadius: layout.borderRadius,
              overflow: "hidden",
            },
          ]}
        >
          OR
        </BrandText>
        <SpacerColumn size={1.5} />
        <ScanQRToSendRequest
          buttonVariant="outline"
          setError={setError}
          style={{ flex: 0 }}
          label="Scan QR"
        />
      </View>
    </BlurScreenContainer>
  );
};
