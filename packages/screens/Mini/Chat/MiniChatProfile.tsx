import * as Clipboard from "expo-clipboard";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useDispatch, useSelector } from "react-redux";

import { CustomButton } from "../components/Button/CustomButton";
import { ScanQRToSendRequest } from "../components/ScanQRToSendRequest";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import checkSVG from "@/assets/icons/checkbox-mini.svg";
import linkSVG from "@/assets/icons/link-white.svg";
import teritoriSVG from "@/assets/icons/networks/teritori-circle.svg";
import { BrandText } from "@/components/BrandText";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SVG } from "@/components/SVG";
import { SVGorImageIcon } from "@/components/SVG/SVGorImageIcon";
import { SpacerColumn } from "@/components/spacer";
import { selectContactInfo, setContactInfo } from "@/store/slices/message";
import { ScreenFC } from "@/utils/navigation";
import {
  neutral00,
  neutral22,
  redDefault,
  secondaryColor,
} from "@/utils/style/colors";
import {
  fontMedium14,
  fontSemibold14,
  fontSemibold18,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { createSharableLink } from "@/weshnet/services";

const QR_SIZE = 248;

export const MiniChatProfileScreen: ScreenFC<"MiniChatProfile"> = () => {
  const [error, setError] = useState("");

  const contactInfo = useSelector(selectContactInfo);
  const dispatch = useDispatch();
  const [isCopied, setIsCopied] = useState(false);

  const shareLink = createSharableLink({
    ...contactInfo,
  });

  useEffect(() => {
    dispatch(
      setContactInfo({
        shareLink,
      }),
    );
  }, [shareLink, dispatch]);

  const sharableLink = contactInfo?.shareLink || "Teritori";

  const onCopyPress = async () => {
    await Clipboard.setStringAsync(sharableLink);

    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 5000);
  };

  return (
    <BlurScreenContainer title="My Teritori ID">
      <View
        style={{
          flex: 1,
          position: "relative",
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
          }}
        >
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
              <BrandText style={[fontSemibold18]}>
                {contactInfo?.name}
              </BrandText>
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
        {error && (
          <>
            <BrandText
              style={[
                fontMedium14,
                {
                  color: redDefault,
                  paddingHorizontal: layout.spacing_x1_5,
                },
              ]}
            >
              {error}
            </BrandText>
            <SpacerColumn size={8} />
          </>
        )}
        <View
          style={{
            position: "absolute",
            bottom: layout.spacing_x1_5,
            width: "100%",
            flexDirection: "row",
            gap: layout?.spacing_x1_5,
            paddingHorizontal: layout.spacing_x2,
          }}
        >
          <ScanQRToSendRequest setError={setError} />
          <CustomButton
            onPress={onCopyPress}
            type="gray"
            style={{
              flexDirection: "row",
              gap: layout?.spacing_x1,
              flex: 1,
              alignItems: "center",
            }}
          >
            <SVG source={linkSVG} height={16} width={16} />
            <BrandText style={[fontSemibold14]}>Copy link</BrandText>
            {isCopied && <SVG source={checkSVG} height={14} width={14} />}
          </CustomButton>
        </View>
      </View>
    </BlurScreenContainer>
  );
};
