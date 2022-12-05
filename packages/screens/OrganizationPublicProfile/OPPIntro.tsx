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
          <View style={{ marginTop: 5, alignItems: "center" }}>
            <BrandText style={[fontBold16]}>{metadata?.public_name}</BrandText>
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
              {metadata?.public_bio}
            </BrandText>

            <View
              style={{
                marginVertical: 16,
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
          />
        </View>
      </View>
    </>
  );
};
