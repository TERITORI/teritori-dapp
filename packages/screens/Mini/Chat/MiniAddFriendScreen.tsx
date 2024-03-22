import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import MiniTextInput from "../components/MiniTextInput";
import { ScanQRToSendRequest } from "../components/ScanQRToSendRequest";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import addSVG from "@/assets/icons/add-new.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { CustomButton } from "@/components/buttons/CustomButton";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
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
  fontSemibold16,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { weshServices } from "@/weshnet";

export const MiniAddFriendScreen: ScreenFC<"MiniAddFriend"> = ({
  navigation,
  route,
}) => {
  const params = route.params;
  const contactUrl = params ? params?.contactUrl : undefined;

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addContactLoading, setAddContactLoading] = useState(false);
  const [contactLink, setContactLink] = useState("");
  const contactInfo = useSelector(selectContactInfo);
  const { setToast } = useFeedbacks();

  const isGroupLink = contactLink.includes("/group");

  useFocusEffect(
    useCallback(() => {
      if (contactUrl) {
        setContactLink(contactUrl);
      }
    }, [contactUrl]),
  );

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
      let conversationId = "";
      const url = new URL(contactLink);
      if (isGroupLink) {
        await weshServices.multiMemberGroupJoin(contactLink, contactInfo);
        conversationId = url?.searchParams.get("publicKey") || "";
      } else {
        await weshServices.addContact(contactLink, contactInfo);
        conversationId = url?.searchParams.get("accountPk") || "";
      }
      setContactLink("");

      setToast({
        mode: "mini",
        message: "Successfully Added!",
        type: "success",
      });

      if (conversationId) {
        navigation.replace("Conversation", { conversationId });
      } else {
        navigation.canGoBack() && navigation.goBack();
      }
    } catch (err: any) {
      setAddContactLoading(false);
      console.error(err.message);

      if (err?.message?.includes("Invalid URL")) {
        setError("Invalid URL.");
      } else if (err?.message?.includes("already present in group")) {
        setError("Already present in group.");
      } else {
        setError(
          isGroupLink ? "Failed to join group." : "Failed to add contact.",
        );
      }
    }
  };

  const inputLabel = !contactLink
    ? "Add new contact or Join a group"
    : isGroupLink
      ? "Join a group"
      : "Add new contact";

  return (
    <BlurScreenContainer title="Add Contact">
      <View style={{ paddingHorizontal: layout.spacing_x2, flex: 1 }}>
        <SpacerColumn size={1} />
        <BrandText style={[fontSemibold16]}>{inputLabel}</BrandText>
        <SpacerColumn size={2} />
        <MiniTextInput
          placeholder="Paste the shared link here"
          style={{ backgroundColor: withAlpha(neutral22, 0.9) }}
          placeholderTextColor={neutralA3}
          value={contactLink}
          onChangeText={setContactLink}
          returnKeyType="done"
          onSubmitEditing={handleAddContact}
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
          <BrandText style={[fontSemibold15, { lineHeight: 18 }]}>
            {isGroupLink ? "Join group" : "Add"}
          </BrandText>
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
