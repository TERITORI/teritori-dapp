import React from "react";
import { TouchableOpacity, View } from "react-native";

import checkSvg from "../../../../assets/icons/Pathwar/checkIcon.svg";
import clockSvg from "../../../../assets/icons/Pathwar/clockIcon.svg";
import diamondSvg from "../../../../assets/icons/Pathwar/diamondIcon.svg";
import starSvg from "../../../../assets/icons/Pathwar/starIcon.svg";
import { Challenge } from "../../../api/pathwar/v1/pathwar";
import { PathWarPrice } from "../../../screens/Pathwar/components/PathWarPrice";
import { PathWarRewards } from "../../../screens/Pathwar/components/PathWarRewards";
import { PathWarTags } from "../../../screens/Pathwar/components/PathWarTags";
import {
  neutral00,
  neutral17,
  neutral44,
  neutral77,
  primaryColor,
  secondaryColor,
} from "../../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import FlexRow from "../../FlexRow";
import { OptimizedImage } from "../../OptimizedImage";
import { SVG } from "../../SVG";
import { Separator } from "../../Separator";
import { TertiaryBox } from "../../boxes/TertiaryBox";

export const DetailsCard: React.FC<{
  data: Challenge;
}> = ({ data }) => {
  return (
    <TertiaryBox
      mainContainerStyle={{ backgroundColor: neutral17 }}
      style={{
        marginBottom: layout.padding_x2_5,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          marginTop: layout.padding_x2,
          marginBottom: layout.padding_x1_5,
          marginLeft: layout.padding_x2,
          marginRight: layout.padding_x2,
          alignItems: "center",
        }}
      >
        <View
          style={{ flexDirection: "column", paddingRight: layout.padding_x2 }}
        >
          <TertiaryBox
            width={200}
            height={200}
            squaresBackgroundColor={neutral17}
          >
            <OptimizedImage
              sourceURI={data.thumbnail}
              style={{
                borderTopRightRadius: 7,
                borderBottomLeftRadius: 7,
              }}
              width={198}
              height={198}
            />
          </TertiaryBox>
          <PathWarPrice price={data.price} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: layout.padding_x1,
            }}
          >
            <TouchableOpacity>
              <TertiaryBox
                width={200}
                height={40}
                squaresBackgroundColor={neutral17}
                mainContainerStyle={{ backgroundColor: secondaryColor }}
              >
                <BrandText style={[{ color: neutral00 }, fontSemibold14]}>
                  Enter
                </BrandText>
              </TertiaryBox>
            </TouchableOpacity>
          </View>
        </View>

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
              width: 390,
            }}
          >
            <View style={{ flexDirection: "column", width: 270 }}>
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
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  backgroundColor: neutral77,
                  width: "fit-content",
                  height: "fit-content",
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BrandText
                  style={[
                    {
                      color: secondaryColor,
                      paddingLeft: layout.padding_x1_5,
                      paddingRight: layout.padding_x1_5,
                      paddingTop: layout.padding_x0_5,
                      paddingBottom: layout.padding_x0_5,
                    },
                    fontSemibold13,
                  ]}
                >
                  Open
                </BrandText>
              </View>
            </View>
          </View>
          <Separator
            style={{
              marginBottom: layout.padding_x2,
              width: 390,
            }}
            color={neutral44}
          />

          <PathWarTags tags={data.tags} />

          <Separator
            style={{
              marginBottom: layout.padding_x2,
              width: 390,
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

          <FlexRow>
            <View style={{ width: 200 }}>
              <FlexRow alignItems="center" style={{ marginBottom: 8 }}>
                <SVG source={checkSvg} />
                <BrandText
                  style={[
                    { color: secondaryColor },
                    fontSemibold12,
                    { marginLeft: 10 },
                  ]}
                >
                  2458 pirates solved it
                </BrandText>
              </FlexRow>
              <FlexRow alignItems="center" style={{ marginBottom: 8 }}>
                <SVG source={starSvg} />
                <BrandText
                  style={[
                    { color: secondaryColor },
                    fontSemibold12,
                    { marginLeft: 10 },
                  ]}
                >
                  Current Star pirate is x0x0_
                </BrandText>
              </FlexRow>
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
                  Average duration: 4’42
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
          </FlexRow>
          <TertiaryBox fullWidth height={67} squaresBackgroundColor={neutral17}>
            <FlexRow style={{ paddingHorizontal: layout.padding_x1_5 }}>
              <View style={{ width: 190 }}>
                <FlexRow alignItems="center" style={{ marginBottom: 10 }}>
                  <BrandText
                    style={[{ color: secondaryColor }, fontSemibold12]}
                  >
                    Top#1:{" "}
                  </BrandText>
                  <BrandText style={[{ color: primaryColor }, fontSemibold12]}>
                    m1ch3l
                  </BrandText>
                </FlexRow>
                <FlexRow alignItems="center">
                  <BrandText
                    style={[{ color: secondaryColor }, fontSemibold12]}
                  >
                    Top#3:{" "}
                  </BrandText>
                  <BrandText style={[{ color: primaryColor }, fontSemibold12]}>
                    gi4RRLLy
                  </BrandText>
                </FlexRow>
              </View>
              <View>
                <FlexRow alignItems="center" style={{ marginBottom: 10 }}>
                  <BrandText
                    style={[{ color: secondaryColor }, fontSemibold12]}
                  >
                    Top#2:{" "}
                  </BrandText>
                  <BrandText style={[{ color: primaryColor }, fontSemibold12]}>
                    m1ch3l
                  </BrandText>
                </FlexRow>
                <PathWarRewards rewards={data.rewards} />
              </View>
            </FlexRow>
          </TertiaryBox>
        </View>
      </View>
    </TertiaryBox>
  );
};
