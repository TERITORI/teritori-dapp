import React from "react";
import { Image, TextStyle, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import defaultUserProfileBannerPNG from "../../../assets/default-images/default-user-profile-banner.png";
import linkSVG from "../../../assets/icons/link.svg";
import locationSVG from "../../../assets/icons/location.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { SecondaryButtonOutline } from "../../components/buttons/SecondaryButtonOutline";
import { AvatarWithFrame } from "../../components/images/AvatarWithFrame";
import { Metadata } from "../../contracts-clients/teritori-name-service/TeritoriNameService.types";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { neutral00, neutral55, purpleDefault } from "../../utils/style/colors";
import { fontBold16, fontMedium14 } from "../../utils/style/fonts";

interface IconTextProps {
  icon: any;
  text: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconProps?: SvgProps;
  iconSize?: number;
}
const IconText: React.FC<IconTextProps> = ({
  icon,
  text,
  style,
  textStyle,
  iconProps,
  iconSize,
}) => {
  return (
    <View style={[{ flexDirection: "row", alignItems: "center" }, style]}>
      <SVG
        source={icon}
        height={iconSize}
        width={iconSize}
        style={{
          marginRight: 4,
        }}
        {...iconProps}
      />
      <BrandText style={[fontMedium14, textStyle]}>{text}</BrandText>
    </View>
  );
};

export const OPPIntro: React.FC<{
  userId: string;
  metadata?: (Metadata & { tokenId: string }) | null;
  isUserOwner?: boolean;
}> = ({ userId, metadata, isUserOwner }) => {
  return (
    <>
      <View>
        <Image
          source={{
            uri: ipfsURLToHTTPURL(
              metadata?.public_profile_header || defaultUserProfileBannerPNG
            ),
          }}
          style={{ height: 320, width: "100%" }}
        />
        <View
          style={{
            position: "absolute",
            top: 217,
            left: 16,
            alignItems: "center",
          }}
        >
          <AvatarWithFrame image={metadata?.image} />
          <View style={{ marginTop: 5 }}>
            <BrandText style={[fontBold16]}>gnopunks</BrandText>
            <BrandText
              style={[fontMedium14, { color: neutral55, marginTop: 2 }]}
            >
              @{metadata?.tokenId || ""}
            </BrandText>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 54,
          }}
        >
          <View
            style={{
              marginTop: 50,
            }}
          >
            <BrandText style={[fontMedium14, { maxWidth: 500 }]}>
              We are 10 000 NFTs living in the GNO blockchain. Pioneers
              community exploring @Teritori dApp & Multichain Experiences!Let’s
              Build together!
            </BrandText>

            <View
              style={{
                marginVertical: 16,
                flexDirection: "row",
              }}
            >
              <IconText
                icon={linkSVG}
                iconSize={21}
                text="www.gnopunks.com"
                style={{ marginRight: 16 }}
                textStyle={{ color: purpleDefault }}
              />
              <IconText
                icon={locationSVG}
                text="Wild internets"
                iconSize={24}
              />
            </View>
          </View>

          <SecondaryButtonOutline
            text="Follow this Teritori"
            size="XL"
            backgroundColor={neutral00}
          />
        </View>
      </View>
    </>
  );
};
