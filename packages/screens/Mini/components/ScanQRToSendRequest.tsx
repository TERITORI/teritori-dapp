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

  const [showQRScanner, setShowQRScanner] = useState(false);
  const [addContactLoading, setAddContactLoading] = useState(false);
  const handleAddContact = async (contactLink: string) => {
    setAddContactLoading(true);
    setError("");

    try {
      if (!contactLink) {
        setError("Please provide the link.");
        setAddContactLoading(false);
        return;
      }

      await weshServices.addContact(contactLink, contactInfo);
    } catch (err: any) {
      console.log(err);
      setError("Failed to add contact.");
    }

    setAddContactLoading(false);
  };

  const onCloseQRSacnnerPress = async (data?: string) => {
    if (data) {
      await handleAddContact(data);
    }
    setShowQRScanner(false);
  };

  const onOpenQRSacnnerPress = () => {
    setShowQRScanner(true);
  };

  return (
    <>
      <CustomButton
        onPress={onOpenQRSacnnerPress}
        type={buttonVariant}
        style={{
          flexDirection: "row",
          gap: layout?.spacing_x1,
          flex: 1,
          alignItems: "center",
          ...style,
        }}
        isDisabled={addContactLoading}
      >
        {addContactLoading && loadingComponent ? (
          loadingComponent
        ) : (
          <>
            <SVG source={cameraSVG} height={20} width={20} />
            <BrandText style={[fontSemibold14]}>
              {addContactLoading ? "Adding Contact" : label || "Tap to scan"}
            </BrandText>
            {addContactLoading && <Spinner />}
          </>
        )}
      </CustomButton>
      {showQRScanner && <QRCodeScannerModal onClose={onCloseQRSacnnerPress} />}
    </>
  );
};
