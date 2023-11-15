import React from "react";
import { View } from "react-native";

import { TopMenuSection } from "./TopMenuSection";
import { DAO } from "../../api/dao/v1/dao";
import { useDAOs } from "../../hooks/dao/useDAOs";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { fontBold11 } from "../../utils/style/fonts";
import { layout, topMenuWidth } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import FlexCol from "../FlexCol";
import FlexRow from "../FlexRow";
import { OmniLink } from "../OmniLink";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SmallCarousel } from "../carousels/SmallCarousel";
import { UserAvatarWithFrame } from "../images/AvatarWithFrame";

//TODO: Make SmallCarousel with items auto sized instead of fix widths
const ORG_CARD_WIDTH = 164;
const ORG_CARD_TAG_WIDTH = 94;

const OrgCard: React.FC<{ organization: DAO }> = ({ organization }) => {
  return (
    <OmniLink
      to={{ screen: "UserPublicProfile", params: { id: organization.id } }}
    >
      <TertiaryBox
        height={48}
        width={ORG_CARD_WIDTH}
        mainContainerStyle={{
          paddingVertical: layout.spacing_x1,
          paddingLeft: layout.spacing_x1,
          paddingRight: layout.spacing_x1_5,
        }}
      >
        <FlexRow alignItems="center">
          <UserAvatarWithFrame
            userId={organization.id}
            size="XXS"
            style={{
              marginRight: layout.spacing_x1,
            }}
          />
          <FlexCol
            justifyContent="space-between"
            width="auto"
            alignItems="flex-start"
          >
            <BrandText
              style={[fontBold11, { width: ORG_CARD_TAG_WIDTH }]}
              numberOfLines={2}
            >
              {organization.name}
            </BrandText>
          </FlexCol>
        </FlexRow>
      </TertiaryBox>
    </OmniLink>
  );
};

export const TopMenuMyTeritories: React.FC = () => {
  const selectedWallet = useSelectedWallet();
  const { daos } = useDAOs({
    networkId: selectedWallet?.networkId,
    memberAddress: selectedWallet?.address,
  });
  if (!daos?.length) return null;
  return (
    <TopMenuSection title="My Teritories" isCarousel>
      {daos && (
        <SmallCarousel
          style={{
            width: topMenuWidth - 2,
          }}
          width={ORG_CARD_WIDTH + layout.spacing_x1_5}
          data={daos}
          height={48}
          loop={false}
          renderItem={({ item }) => (
            <View style={{ alignItems: "flex-end" }}>
              <OrgCard organization={item} />
            </View>
          )}
        />
      )}
    </TopMenuSection>
  );
};
