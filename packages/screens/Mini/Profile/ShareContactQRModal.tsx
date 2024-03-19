import React from "react";
import { View, useWindowDimensions } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useSelector } from "react-redux";

import { CustomButton } from "../components/Button/CustomButton";
import MobileModal from "../components/MobileModal";

import teritoriSVG from "@/assets/icons/networks/teritori-circle.svg";
import { BrandText } from "@/components/BrandText";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SVGorImageIcon } from "@/components/SVG/SVGorImageIcon";
import { selectContactInfo } from "@/store/slices/message";
import { neutral00, neutral22, secondaryColor } from "@/utils/style/colors";
import { fontSemibold18, fontSemibold24 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
const QR_SIZE = 248;

export const ShareContactQRModal = ({
  onClose,
  isOpen,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const contactInfo = useSelector(selectContactInfo);

  const sharableLink = contactInfo?.shareLink || "Teritori";

  return (
    <MobileModal
      visible={isOpen}
      onClose={onClose}
      innerContainerOptions={{
        height: 520,
      }}
    >
      <View
        style={{
          padding: layout.spacing_x2,
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
          marginBottom: layout.spacing_x4,
        }}
      >
        <BrandText
          style={[
            fontSemibold24,
            {
              marginVertical: layout.spacing_x1,
              marginHorizontal: layout.spacing_x2_5,
              alignSelf: "flex-start",
            },
          ]}
        >
          My Contact QR
        </BrandText>

        <View
          style={{
            padding: layout.spacing_x1_5,
            backgroundColor: neutral22,
            borderRadius: layout.borderRadius,
            alignSelf: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: layout.spacing_x1,
              marginBottom: layout.spacing_x1,
              justifyContent: "center",
            }}
          >
            {contactInfo?.avatar ? (
              <OptimizedImage
                sourceURI={contactInfo?.avatar}
                height={32}
                width={32}
                style={{ borderRadius: 32 }}
              />
            ) : (
              <SVGorImageIcon
                iconSize={32}
                icon={contactInfo?.avatar || teritoriSVG}
              />
            )}
            <BrandText style={[fontSemibold18]}>{contactInfo?.name}</BrandText>
          </View>
          {sharableLink && (
            <QRCode
              size={QR_SIZE}
              value={sharableLink}
              quietZone={layout.spacing_x2}
              color={secondaryColor}
              backgroundColor={neutral00}
            />
          )}
        </View>
      </View>
      <CustomButton
        title="Close"
        onPress={onClose}
        width={windowWidth - 40}
        style={{
          marginVertical: layout.spacing_x1,
          marginHorizontal: layout.spacing_x2_5,
          alignSelf: "center",
        }}
      />
    </MobileModal>
  );
};
