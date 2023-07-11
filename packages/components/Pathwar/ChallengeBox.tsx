import React, { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import { ChallengeDetails } from "./ChallengeDetailsFiles/ChallengeDetails";
import checkSvg from "../../../assets/icons/Pathwar/checkIcon.svg";
import clockSvg from "../../../assets/icons/Pathwar/clockIcon.svg";
import diamondSvg from "../../../assets/icons/Pathwar/diamondIcon.svg";
import starSvg from "../../../assets/icons/Pathwar/starIcon.svg";
import { Challenge } from "../../api/pathwar/v1/pathwar";
import { PathWarRewards } from "../../screens/Pathwar/components/PathWarRewards";
import { PathWarTags } from "../../screens/Pathwar/components/PathWarTags";
import { UserWIthTNS } from "../../screens/Pathwar/components/UserWIthTNS";
import { prettyPrice } from "../../utils/coins";
import {
  neutral00,
  neutral17,
  neutral44,
  neutral77,
  secondaryColor,
} from "../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
} from "../../utils/style/fonts";
import { layout, screenContentMaxWidthLarge } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { CurrencyIcon } from "../CurrencyIcon";
import FlexRow from "../FlexRow";
import { OptimizedImage } from "../OptimizedImage";
import { SVG } from "../SVG";
import { Separator } from "../Separator";
import { PrimaryBadge } from "../badges/PrimaryBadge";
import { TertiaryBox } from "../boxes/TertiaryBox";

function LeftRail(props: {
  sourceURI: string;
  price: Money | undefined;
  onPress: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: "column",
        paddingRight: layout.padding_x2,
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <View>
        <TertiaryBox
          width={200}
          height={200}
          squaresBackgroundColor={neutral17}
        >
          <OptimizedImage
            sourceURI={props.sourceURI}
            style={{
              borderTopRightRadius: 7,
              borderBottomLeftRadius: 7,
            }}
            height={198}
            width={198}
          />
        </TertiaryBox>
        <TertiaryBox
          width={200}
          height={47}
          squaresBackgroundColor={neutral17}
          style={{ marginTop: layout.padding_x1 }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              width: "100%",
            }}
          >
            <BrandText style={[{ color: neutral77 }, fontSemibold13]}>
              Price
            </BrandText>
            {props.price && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <BrandText
                  style={[
                    fontSemibold13,
                    {
                      marginRight: layout.padding_x0_5,
                    },
                  ]}
                >
                  {prettyPrice(
                    "teritori",
                    props.price?.amount,
                    props.price?.denom
                  )}
                </BrandText>
                <CurrencyIcon
                  networkId="teritori"
                  denom={props.price?.denom}
                  size={16}
                />
              </View>
            )}{" "}
          </View>
        </TertiaryBox>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: layout.padding_x1,
        }}
      >
        <TouchableOpacity>
          <TertiaryBox
            width={110}
            height={40}
            squaresBackgroundColor={neutral17}
            mainContainerStyle={{ backgroundColor: secondaryColor }}
          >
            <BrandText style={[{ color: neutral00 }, fontSemibold14]}>
              Buy
            </BrandText>
          </TertiaryBox>
        </TouchableOpacity>
        <TouchableOpacity onPress={props.onPress}>
          <TertiaryBox
            width={80}
            height={40}
            squaresBackgroundColor={neutral17}
            mainContainerStyle={{ borderColor: secondaryColor }}
          >
            <BrandText style={[{ color: secondaryColor }, fontSemibold14]}>
              More
            </BrandText>
          </TertiaryBox>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const ChallengeBox: React.FC<{
  data: Challenge;
}> = ({ data }) => {
  const [displayChallengeDetails, setDisplayChallengeDetails] = useState(false);

  return (
    <TertiaryBox
      width={680}
      mainContainerStyle={{ backgroundColor: neutral17 }}
      style={{
        marginBottom: layout.padding_x2_5,
        marginLeft: layout.padding_x1,
        marginRight: layout.padding_x1,
      }}
    >
      {/*<ChallengeDetails*/}
      {/*  data={data}*/}
      {/*  visible={displayChallengeDetails}*/}
      {/*  onClose={() => {*/}
      {/*    setDisplayChallengeDetails(false);*/}
      {/*  }}*/}
      {/*/>*/}
      <View
        style={{
          flexDirection: "row",
          margin: layout.padding_x2,
        }}
      >
        <LeftRail
          sourceURI={data.thumbnail}
          price={data.price}
          onPress={() => setDisplayChallengeDetails(true)}
        />

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
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  backgroundColor: neutral77,
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
                  {data.status}
                </BrandText>
              </View>
            </View>
          </View>

          {/*<Separator*/}
          {/*  style={{*/}
          {/*    marginBottom: layout.padding_x2,*/}
          {/*    width: "100%",*/}
          {/*  }}*/}
          {/*  color={neutral44}*/}
          {/*/>*/}

          <PathWarTags tags={data.tags} />

          {/*<Separator*/}
          {/*  style={{*/}
          {/*    marginBottom: layout.padding_x2,*/}
          {/*    width: "100%",*/}
          {/*  }}*/}
          {/*  color={neutral44}*/}
          {/*/>*/}

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
              width: 440,
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
                  <View
                    style={{ marginBottom: 8, marginLeft: layout.padding_x1 }}
                  >
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
          <TertiaryBox squaresBackgroundColor={neutral17} width={440}>
            <FlatList
              data={data.topUsers}
              style={{
                width: 440,
                padding: layout.padding_x2,
              }}
              contentContainerStyle={{
                width: 440,
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
          <PathWarRewards
            rewards={data.rewards}
            style={{
              paddingTop: layout.padding_x2,
              flexDirection: "row",
              flexWrap: "wrap",
              width: "100%",
            }}
          />
        </View>
      </View>
    </TertiaryBox>
  );
};
