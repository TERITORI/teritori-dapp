import React from "react";
import { FlatList, View } from "react-native";

import checkSvg from "../../../../assets/icons/pathwar/checkIcon.svg";
import clockSvg from "../../../../assets/icons/pathwar/clockIcon.svg";
import diamondSvg from "../../../../assets/icons/pathwar/diamondIcon.svg";
import starSvg from "../../../../assets/icons/pathwar/starIcon.svg";
import { Challenge } from "../../../api/pathwar/v1/pathwar";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { LeftRail } from "../../../screens/Pathwar/components/Listing/LeftRail";
import { StatusBadges } from "../../../screens/Pathwar/components/Listing/StatusBadges";
import { PathWarRewards } from "../../../screens/Pathwar/components/PathWarRewards";
import { PathWarTags } from "../../../screens/Pathwar/components/PathWarTags";
import { UserWIthTNS } from "../../../screens/Pathwar/components/UserWIthTNS";
import {
  neutral17,
  neutral44,
  neutral77,
  secondaryColor,
} from "../../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold16,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import FlexRow from "../../FlexRow";
import { SVG } from "../../SVG";
import { Separator } from "../../Separator";
import { TertiaryBox } from "../../boxes/TertiaryBox";
const WIDTH = 380;
export const DetailsCard: React.FC<{
  data: Challenge;
  onMoreButtonPress?: () => void;
}> = ({ data, onMoreButtonPress }) => {
  const isMobile = useIsMobile();

  return (
    <View
      style={{
        flexDirection: isMobile ? "column" : "row",
        margin: layout.padding_x2,
      }}
    >
      <LeftRail
        sourceURI={data.thumbnail}
        price={data.price}
        onMoreButtonPress={
          onMoreButtonPress ? () => onMoreButtonPress() : undefined
        }
      />

      <RightRail data={data} />
    </View>
  );
};

export const RightRail: React.FC<{ data: Challenge }> = ({ data }) => {
  return (
    <View
      style={{
        flexDirection: "column",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: layout.padding_x1_5,
        }}
      >
        <View style={{ flexDirection: "column" }}>
          <BrandText style={[{ color: secondaryColor }, fontSemibold16]}>
            {data.title}
          </BrandText>
          <BrandText
            style={[
              { color: neutral77, marginTop: layout.padding_x0_5 },
              fontSemibold13,
            ]}
          >
            {data.description}
          </BrandText>
        </View>
        <StatusBadges difficulty={data.difficulty} label={data.status} />
      </View>

      <Separator
        style={{
          marginBottom: layout.padding_x2,
          width: "100%",
        }}
        color={neutral44}
      />

      <PathWarTags data={data.tags} width={WIDTH} />

      <Separator
        style={{
          marginBottom: layout.padding_x2,
          width: "100%",
        }}
        color={neutral44}
      />

      <BrandText
        style={[
          { color: neutral77, marginBottom: layout.padding_x0_5 },
          fontSemibold13,
        ]}
      >
        Statistics about this challenge:
      </BrandText>

      <View
        style={{
          flexDirection: "row",
          width: WIDTH,
          padding: layout.padding_x1,
          justifyContent: "space-between",
        }}
      >
        <View>
          <FlexRow alignItems="center" style={{ marginBottom: 8 }}>
            <SVG source={checkSvg} />
            <BrandText
              style={[
                {
                  color: secondaryColor,
                  marginLeft: layout.padding_x1,
                },
                fontSemibold12,
              ]}
            >
              {data.solvedCount} pirates solved it
            </BrandText>
          </FlexRow>
          {data.starUser && (
            <View
              style={{
                marginBottom: 8,
                flexDirection: "row",
                flexWrap: "nowrap",
                alignItems: "center",
              }}
            >
              <SVG source={starSvg} style={{}} />
              <View style={{ marginBottom: 8, marginLeft: layout.padding_x1 }}>
                <BrandText
                  style={[
                    {
                      color: secondaryColor,
                    },
                    fontSemibold12,
                  ]}
                >
                  Current Star pirate is{" "}
                </BrandText>

                <UserWIthTNS address={data.starUser.address} label="" />
              </View>
            </View>
          )}
        </View>
        <View>
          <FlexRow alignItems="center" style={{ marginBottom: 8 }}>
            <SVG source={clockSvg} />
            <BrandText
              style={[
                { color: secondaryColor },
                fontSemibold12,
                { marginLeft: 10 },
              ]}
            >
              Average duration: {data.duration}
            </BrandText>
          </FlexRow>
          <FlexRow alignItems="center" style={{ marginBottom: 8 }}>
            <SVG source={diamondSvg} />
            <BrandText
              style={[
                { color: secondaryColor },
                fontSemibold12,
                { marginLeft: 10 },
              ]}
            >
              Related booty
            </BrandText>
          </FlexRow>
        </View>
      </View>
      <TertiaryBox squaresBackgroundColor={neutral17} width={WIDTH}>
        <FlatList
          data={data.topUsers}
          style={{
            width: WIDTH,
            padding: layout.padding_x2,
          }}
          contentContainerStyle={{
            width: WIDTH,
          }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            flexWrap: "wrap",
            flex: 1,
            marginTop: 5,
          }}
          showsHorizontalScrollIndicator={false}
          numColumns={99}
          ListEmptyComponent={
            <BrandText style={[fontSemibold20, { textAlign: "center" }]}>
              No users solved this challenge yet.
            </BrandText>
          }
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  marginRight: layout.padding_x1,
                  marginBottom: layout.padding_x1,
                }}
              >
                <UserWIthTNS
                  address={item.address}
                  label={`Top#${index + 1}`}
                />
              </View>
            );
          }}
        />
      </TertiaryBox>
      {data.rewards.length > 0 && (
        <PathWarRewards
          rewards={data.rewards}
          style={{
            position: "absolute",
            bottom: 0,
            paddingTop: layout.padding_x2,
            flexDirection: "row",
            flexWrap: "wrap",
            width: "100%",
          }}
        />
      )}
    </View>
  );
};
