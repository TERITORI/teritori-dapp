import React from "react";
import { Image, Linking, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

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
import { layout } from "../../utils/style/layout";

export const PublicProfileIntro: React.FC<{
  metadata?: Metadata | any | null;
}> = ({ metadata }) => {
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
        <AvatarWithFrame
          image={metadata?.image}
          size="XL"
          style={{
            position: "absolute",
            top: 100,
            left: 24,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: layout.padding_x3,
          }}
        >
          <View>
            <View
              style={{
                marginBottom: layout.padding_x1_5,
              }}
            >
              <BrandText style={[fontBold16]}>
                {metadata?.public_name}
              </BrandText>
              <BrandText
                style={[fontMedium14, { color: neutral55, marginTop: 2 }]}
              >
                @{metadata?.tokenId || ""}
              </BrandText>
            </View>

            <BrandText
              style={[fontMedium14, { maxWidth: 735 }]}
              numberOfLines={6}
            >
              {metadata?.public_bio}
            </BrandText>

            <View
              style={{
                marginVertical: layout.padding_x1_5,
                flexDirection: "row",
              }}
            >
              {!!metadata?.external_url && (
                <View style={[{ flexDirection: "row", alignItems: "center" }]}>
                  <SVG
                    source={linkSVG}
                    height={21}
                    width={21}
                    style={{
                      marginRight: 4,
                    }}
                  />
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => Linking.openURL(metadata.external_url || "")}
                  >
                    <BrandText style={[fontMedium14, { color: purpleDefault }]}>
                      {metadata?.external_url}
                    </BrandText>
                  </TouchableOpacity>
                </View>
              )}

              {!!metadata?.validator_operator_address && (
                <View style={[{ flexDirection: "row", alignItems: "center" }]}>
                  <SVG
                    source={locationSVG}
                    height={24}
                    width={24}
                    style={{
                      marginRight: 4,
                    }}
                  />
                  <BrandText style={[fontMedium14]}>
                    {metadata?.validator_operator_address}
                  </BrandText>
                </View>
              )}
            </View>
          </View>

          <SecondaryButtonOutline
            text="Follow this Teritori"
            size="XL"
            backgroundColor={neutral00}
            disabled
          />
        </View>
      </View>
    </>
  );
};
