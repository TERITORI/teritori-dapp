import React from "react";
import { Image, View } from "react-native";

import { TopMenuSection } from "./TopMenuSection";
import { DAO } from "../../api/dao/v1/dao";
import { useDAOs } from "../../hooks/dao/useDAOs";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { neutral77 } from "../../utils/style/colors";
import { fontBold11, fontMedium10 } from "../../utils/style/fonts";
import { layout, topMenuWidth } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import FlexCol from "../FlexCol";
import FlexRow from "../FlexRow";
import { OmniLink } from "../OmniLink";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SmallCarousel } from "../carousels/SmallCarousel";

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
          <Image
            source={{ uri: organization.imageUrl }}
            style={{
              borderRadius: 999,
              marginRight: layout.spacing_x1,
              minHeight: 32,
              minWidth: 32,
              width: 32,
              height: 32,
            }}
          />
          <FlexCol
            justifyContent="space-between"
            width="auto"
            alignItems="flex-start"
          >
            <BrandText style={[fontBold11]}>{organization.name}</BrandText>
            <BrandText
              style={[
                fontMedium10,
                {
                  color: neutral77,
                  width: ORG_CARD_TAG_WIDTH,
                },
              ]}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {organization.tokenName}
            </BrandText>
          </FlexCol>
        </FlexRow>
      </TertiaryBox>
    </OmniLink>
  );
};

export const TopMenuMyTeritories: React.FC = () => {
  const networkId = useSelectedNetworkId();

  const { daos } = useDAOs({ networkId });
  return (
    <TopMenuSection title="All DAOs" isCarousel>
      {daos && (
        <>
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
        </>
      )}
    </TopMenuSection>
  );
};
