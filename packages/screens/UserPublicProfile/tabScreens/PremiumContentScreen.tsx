import React, { FC, useState } from "react";
import { View } from "react-native";

import handSVG from "../../../../assets/icons/hand.svg";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { UppTabKeys } from "../../../utils/upp";
import { UppTabScreenProps } from "../UserPublicProfileScreen";
import { UPPHeader } from "../components/UPPHeader";
import { UPPScreenContentWrapper } from "../components/UPPScreenContentWrapper";
import { PremiumSubscriptionModal } from "../components/modals/PremiumSubscriptionModal";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { SpacerColumn } from "@/components/spacer";
import { neutral33, neutralA3, secondaryColor } from "@/utils/style/colors";
import { fontSemibold13, fontSemibold16 } from "@/utils/style/fonts";

export const PremiumContentScreen: FC<UppTabScreenProps> = ({
  userId,
  screenContainerOtherProps,
}) => {
  const [premiumSubscriptionModalVisible, setPremiumSubscriptionModalVisible] =
    useState(false);
  return (
    <ScreenContainer
      key={`${UppTabKeys.Subscrib} ${userId}`} // this key is to reset the screen state when the id changes
      {...screenContainerOtherProps}
    >
      <UPPScreenContentWrapper>
        <UPPHeader userId={userId} selectedTab={UppTabKeys.Subscrib} />
        <PrimaryBox
          style={{
            height: 186,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            borderColor: neutral33,
          }}
        >
          <View
            style={{
              backgroundColor: "rgba(244, 111, 118, 0.1)",
              borderRadius: 45,
              width: 32,
              height: 32,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SVG source={handSVG} width={20} height={20} />
          </View>
          <SpacerColumn size={1} />

          <BrandText style={[fontSemibold16, { color: secondaryColor }]}>
            No access
          </BrandText>
          <SpacerColumn size={1} />

          <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
            This zone is restricted to Subscribers, to join click below
          </BrandText>
          <SpacerColumn size={1} />

          <SecondaryButton
            width={90}
            size="XS"
            text="Subscribe"
            loader
            onPress={() => {
              setPremiumSubscriptionModalVisible(true);
            }}
          />
        </PrimaryBox>

        <PremiumSubscriptionModal
          onClose={() => setPremiumSubscriptionModalVisible(false)}
          isVisible={premiumSubscriptionModalVisible}
          userId={userId}
        />
      </UPPScreenContentWrapper>
    </ScreenContainer>
  );
};
