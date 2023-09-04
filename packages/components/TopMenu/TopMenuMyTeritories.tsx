import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { TopMenuSection } from "./TopMenuSection";
import orgGnoPunksPNG from "../../../assets/default-images/orgGnopunks.png";
import orgJungleDefendersPNG from "../../../assets/default-images/orgJungleDefenders.png";
import { neutral00, neutral77 } from "../../utils/style/colors";
import {
  fontBold11,
  fontMedium10,
  fontSemibold14,
} from "../../utils/style/fonts";
import { layout, topMenuWidth } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import FlexCol from "../FlexCol";
import FlexRow from "../FlexRow";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { CustomPressable } from "../buttons/CustomPressable";
import { SmallCarousel } from "../carousels/SmallCarousel";

//TODO: Make SmallCarousel with items auto sized instead of fix widths
const ORG_CARD_WIDTH = 164;
const ORG_CARD_TAG_WIDTH = 94;

type FakeOrg = {
  name: string;
  image: string;
  tag: string;
};
const fakeOrgs: FakeOrg[] = [
  { name: "GNOPUNKS", tag: "@GNOPUNKS.teritori", image: orgGnoPunksPNG },
  {
    name: "Jungle Defenders",
    tag: "@JungleDefenders.teritori",
    image: orgJungleDefendersPNG,
  },
  { name: "Fake 3", tag: "@JungleDefenders.teritori", image: orgGnoPunksPNG },
  { name: "Fake 4", tag: "@sqfsf.teritori", image: orgJungleDefendersPNG },
  { name: "Fake 5", tag: "@FGDGDG_sgdgdgdi.teritori", image: orgGnoPunksPNG },
];

const OrgCard: React.FC<{ organization: FakeOrg }> = ({ organization }) => {
  return (
    <TouchableOpacity onPress={() => {}}>
      <TertiaryBox
        height={48}
        width={ORG_CARD_WIDTH}
        mainContainerStyle={styles.orgCardBoxMainContainer}
      >
        <FlexRow alignItems="center">
          <Image
            source={{ uri: organization.image }}
            style={styles.orgCardImage}
          />
          <FlexCol
            justifyContent="space-between"
            width="auto"
            alignItems="flex-start"
          >
            <BrandText style={styles.orgCardName}>
              {organization.name}
            </BrandText>
            <BrandText
              style={styles.orgCardTag}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {organization.tag}
            </BrandText>
          </FlexCol>
        </FlexRow>
      </TertiaryBox>
    </TouchableOpacity>
  );
};

const OrgsComingSoon: React.FC = () => (
  <>
    <FlexCol style={styles.comingSoonBackground} />
    <FlexCol style={styles.comingSoonContainer}>
      <BrandText style={styles.comingSoonText}>Coming Soon</BrandText>
    </FlexCol>
  </>
);

//TODO: Remove CustomPressable and OrgsComingSoon when the Multisig feature is available

export const TopMenuMyTeritories: React.FC = () => {
  return (
    <TopMenuSection title="My Teritories" isCarousel>
      <CustomPressable>
        {({ hovered }) => (
          <>
            <SmallCarousel
              style={{
                width: topMenuWidth - 2,
              }}
              width={ORG_CARD_WIDTH + layout.spacing_x1_5}
              data={fakeOrgs}
              height={48}
              loop={false}
              renderItem={({ item }) => (
                <View style={{ alignItems: "flex-end" }}>
                  <OrgCard organization={item} />
                </View>
              )}
            />
            {hovered && <OrgsComingSoon />}
          </>
        )}
      </CustomPressable>
    </TopMenuSection>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  comingSoonContainer: {
    zIndex: 21,
    height: "100%",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
  },
  comingSoonBackground: {
    zIndex: 20,
    backgroundColor: neutral00,
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    opacity: 0.7,
  },
  comingSoonText: {
    ...(fontSemibold14 as object),
  },

  orgCardBoxMainContainer: {
    paddingVertical: layout.spacing_x1,
    paddingLeft: layout.spacing_x1,
    paddingRight: layout.spacing_x1_5,
  },
  orgCardImage: {
    borderRadius: 999,
    marginRight: layout.spacing_x1,
    minHeight: 32,
    minWidth: 32,
    width: 32,
    height: 32,
  },
  orgCardName: {
    ...(fontBold11 as object),
  },
  orgCardTag: {
    ...(fontMedium10 as object),
    color: neutral77,
    width: ORG_CARD_TAG_WIDTH,
  },
});
