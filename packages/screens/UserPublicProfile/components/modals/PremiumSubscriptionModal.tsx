import React from "react";
import { View } from "react-native";

import { PrimaryButton } from "../../../../components/buttons/PrimaryButton";
import ModalBase from "../../../../components/modals/ModalBase";
import { layout } from "../../../../utils/style/layout";

import { BrandText } from "@/components/BrandText";
import { RoundedGradientImage } from "@/components/images/RoundedGradientImage";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn } from "@/components/spacer";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { parseUserId } from "@/networks";
import { DEFAULT_NAME } from "@/utils/social-feed";
import { neutral55, neutral77, secondaryColor } from "@/utils/style/colors";
import {
  fontBold16,
  fontMedium14,
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
} from "@/utils/style/fonts";

export const PremiumSubscriptionModal: React.FC<{
  onClose: () => void;
  isVisible: boolean;
  userId: string;
}> = ({ onClose, isVisible, userId }) => {
  const { metadata } = useNSUserInfo(userId);
  const [, userAddress] = parseUserId(userId);

  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      width={464}
      label="Premium Subscription"
      childrenBottom={
        <View style={{ width: "100%" }}>
          <Separator />

          <View
            style={{
              margin: layout.spacing_x2,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <BrandText
                style={[fontSemibold14, { color: neutral77, lineHeight: 20 }]}
              >
                Subscription price:
              </BrandText>

              <SpacerColumn size={1} />

              <BrandText style={[fontSemibold20, { color: secondaryColor }]}>
                $9.99
              </BrandText>
            </View>

            <View>
              <View
                style={{
                  flex: 1,
                  alignItems: "flex-end",
                }}
              >
                <BrandText
                  style={[fontSemibold14, { color: neutral77, lineHeight: 20 }]}
                >
                  Pay by :
                </BrandText>
              </View>
              <SpacerColumn size={1} />

              <BrandText
                style={[fontSemibold14, { color: neutral77, lineHeight: 20 }]}
              >
                Balance:{" "}
                <BrandText
                  style={[
                    fontSemibold14,
                    { color: secondaryColor, lineHeight: 20 },
                  ]}
                >
                  105K TORI{" "}
                  <BrandText
                    style={[
                      fontSemibold14,
                      { color: neutral77, lineHeight: 20 },
                    ]}
                  >
                    $5,846.63
                  </BrandText>
                </BrandText>
              </BrandText>
            </View>
          </View>
          <View
            style={{
              alignItems: "center",
              marginVertical: layout.spacing_x2,
            }}
          >
            <PrimaryButton
              size="XL"
              text="Subscribe"
              width={424}
              loader
              onPress={onClose}
            />
          </View>
        </View>
      }
    >
      <View
        style={{
          alignItems: "center",
          width: "100%",
          marginBottom: layout.spacing_x1,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <BrandText style={[fontSemibold16, { color: neutral77 }]}>
            You're going to subscribe to
          </BrandText>

          <SpacerColumn size={2} />

          <RoundedGradientImage
            sourceURI={metadata.image}
            style={{ marginRight: 24 }}
          />
          <SpacerColumn size={2} />

          {metadata?.tokenId ? (
            <>
              <BrandText style={[fontBold16]}>
                {metadata?.public_name}
              </BrandText>
              <BrandText
                style={[fontMedium14, { color: neutral55, marginTop: 2 }]}
              >
                @{metadata.tokenId}
              </BrandText>
            </>
          ) : (
            <>
              <BrandText style={[fontBold16]}>{DEFAULT_NAME}</BrandText>
              <BrandText
                style={[fontMedium14, { color: neutral55, marginTop: 2 }]}
              >
                @{userAddress}
              </BrandText>
            </>
          )}
        </View>
      </View>
    </ModalBase>
  );
};
