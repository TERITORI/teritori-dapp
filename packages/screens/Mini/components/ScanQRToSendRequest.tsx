import React, { useState } from "react";
import { ViewStyle } from "react-native";
import { useSelector } from "react-redux";

import { CustomButton, CustomButtonTypes } from "./Button/CustomButton";

import cameraSVG from "@/assets/icons/camera-white.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { Spinner } from "@/components/Spinner";
import { QRCodeScannerModal } from "@/components/modals/QRCodeScannerModal";
import { selectContactInfo } from "@/store/slices/message";
import { useAppNavigation } from "@/utils/navigation";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { weshServices } from "@/weshnet";

type Props = {
  setError: (text: string) => void;
  label?: string;
  buttonVariant?: CustomButtonTypes;
  loadingComponent?: React.ReactNode;
  style?: ViewStyle;
};

export const ScanQRToSendRequest = ({
  setError,
  label,
  buttonVariant = "gray",
  loadingComponent,
  style,
}: Props) => {
  const contactInfo = useSelector(selectContactInfo);
  const navigation = useAppNavigation();

  const [showQRScanner, setShowQRScanner] = useState(false);
  const [loading, setLoading] = useState({ status: false, type: "" });

  const handleAddContact = async (contactLink: string) => {
    setLoading({ status: true, type: "contact" });
    setError("");

    try {
      if (!contactLink) {
        setError("Please provide the link.");
        setLoading({ status: false, type: "" });
        return;
      }

      await weshServices.addContact(contactLink, contactInfo);
      const url = new URL(contactLink);
      const conversationId = url?.searchParams.get("accountPk");
      if (conversationId) {
        navigation.replace("Conversation", { conversationId });
      }
    } catch (err: any) {
      console.log(err);
      setError("Failed to add contact.");
    }

    setLoading({ status: false, type: "" });
  };

  const handleAddGroup = async (contactLink: string) => {
    setLoading({ status: true, type: "group" });
    setError("");

    try {
      if (!contactLink) {
        setError("Please provide the link.");
        setLoading({ status: false, type: "" });
        return;
      }

      await weshServices.multiMemberGroupJoin(contactLink, contactInfo);
      const url = new URL(contactLink);
      const conversationId = url?.searchParams.get("publicKey");
      if (conversationId) {
        navigation.replace("Conversation", { conversationId });
      }
    } catch (err: any) {
      console.log(err);
      setError("Failed to join group.");
    }

    setLoading({ status: false, type: "" });
  };

  const onCloseQRScannerPress = async (data?: string) => {
    if (data?.includes("contact")) {
      await handleAddContact(data);
    }
    if (data?.includes("group")) {
      await handleAddGroup(data);
    }
    setShowQRScanner(false);
  };

  const onOpenQRScannerPress = () => {
    setShowQRScanner(true);
  };

  return (
    <>
      <CustomButton
        onPress={onOpenQRScannerPress}
        type={buttonVariant}
        style={{
          flexDirection: "row",
          gap: layout?.spacing_x1,
          flex: 1,
          alignItems: "center",
          ...style,
        }}
        isDisabled={loading.status}
      >
        {loading.status && loadingComponent ? (
          loadingComponent
        ) : (
          <>
            <SVG source={cameraSVG} height={20} width={20} />
            <BrandText style={[fontSemibold14]}>
              {loading.status
                ? loading.type === "group"
                  ? "Joining Group"
                  : "Adding Contact"
                : label || "Tap to scan"}
            </BrandText>
            {loading.status && <Spinner />}
          </>
        )}
      </CustomButton>
      {showQRScanner && <QRCodeScannerModal onClose={onCloseQRScannerPress} />}
    </>
  );
};
