import React, { useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";

import challengePic1 from "../../../assets/PathwarIllustration/challenge1.png";
import challengePic10 from "../../../assets/PathwarIllustration/challenge10.png";
import challengePic11 from "../../../assets/PathwarIllustration/challenge11.png";
import challengePic12 from "../../../assets/PathwarIllustration/challenge12.png";
import challengePic2 from "../../../assets/PathwarIllustration/challenge2.png";
import challengePic3 from "../../../assets/PathwarIllustration/challenge3.png";
import challengePic4 from "../../../assets/PathwarIllustration/challenge4.png";
import challengePic5 from "../../../assets/PathwarIllustration/challenge5.png";
import challengePic6 from "../../../assets/PathwarIllustration/challenge6.png";
import challengePic7 from "../../../assets/PathwarIllustration/challenge7.png";
import challengePic8 from "../../../assets/PathwarIllustration/challenge8.png";
import challengePic9 from "../../../assets/PathwarIllustration/challenge9.png";
import pwn from "../../../assets/icons/Pathwar/PathwarCoin/pwn.svg";
import { SVG } from "../../components/SVG";
import {
  neutral44,
  neutral77,
  neutral17,
  secondaryColor,
  neutral00,
} from "../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
  fontSemibold12,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { Separator } from "../Separator";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { ChallengeDetails } from "./ChallengeDetailsFiles/ChallengeDetails";

const listPictures = [
  challengePic1,
  challengePic2,
  challengePic3,
  challengePic4,
  challengePic5,
  challengePic6,
  challengePic7,
  challengePic8,
  challengePic9,
  challengePic10,
  challengePic11,
  challengePic12,
];

export const ChallengeBox: React.FC<{
  title: string;
  description: string;
  tags: string[];
  price: string;
  reward: string;
  indexPicture: number;
}> = ({ title, description, tags, price, reward, indexPicture }) => {
  const [displayChallengeDetails, setDisplayChallengeDetails] = useState(false);

  function handleDisplayChallengeDetails() {
    if (displayChallengeDetails === true) {
      return (
        <ChallengeDetails
          title={title}
          description={description}
          tags={tags}
          price={price}
          reward={reward}
          indexPicture={indexPicture}
          visible
          onClose={() => {
            setDisplayChallengeDetails(false);
          }}
        />
      );
    }
  }

  return (
    <TertiaryBox
      mainContainerStyle={{ backgroundColor: neutral17 }}
      style={{
        marginBottom: layout.padding_x2_5,
        marginLeft: layout.padding_x1,
        marginRight: layout.padding_x1,
      }}
    >
      {handleDisplayChallengeDetails()}
      <View
        style={{
          flexDirection: "row",
          marginTop: layout.padding_x2,
          marginBottom: layout.padding_x2,
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
            differentSquaresColor
            leftSquaresBackgroundColor={neutral17}
            rightSquaresBackgroundColor={neutral17}
          >
            <Image
              source={listPictures[indexPicture]}
              style={{
                width: 198,
                height: 198,
                borderTopRightRadius: 7,
                borderBottomLeftRadius: 7,
              }}
            />
          </TertiaryBox>
          <TertiaryBox
            width={200}
            height={47}
            differentSquaresColor
            leftSquaresBackgroundColor={neutral17}
            rightSquaresBackgroundColor={neutral17}
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
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <BrandText style={[{ color: secondaryColor }, fontSemibold13]}>
                  {price ? "$" + price : "Free"}
                </BrandText>
                {price ? (
                  <SVG
                    source={pwn}
                    width={42}
                    height={42}
                    style={{ marginBottom: layout.padding_x0_25 }}
                  />
                ) : null}
              </View>
            </View>
          </TertiaryBox>
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
                differentSquaresColor
                leftSquaresBackgroundColor={neutral17}
                rightSquaresBackgroundColor={neutral17}
                mainContainerStyle={{ backgroundColor: secondaryColor }}
              >
                <BrandText style={[{ color: neutral00 }, fontSemibold14]}>
                  Enter
                </BrandText>
              </TertiaryBox>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDisplayChallengeDetails(true)}>
              <TertiaryBox
                width={80}
                height={40}
                differentSquaresColor
                leftSquaresBackgroundColor={neutral17}
                rightSquaresBackgroundColor={neutral17}
                mainContainerStyle={{ borderColor: secondaryColor }}
              >
                <BrandText style={[{ color: secondaryColor }, fontSemibold14]}>
                  More
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
                {title}
              </BrandText>
              <BrandText
                style={[
                  { color: neutral77, marginTop: layout.padding_x0_5 },
                  fontSemibold13,
                ]}
              >
                {description}
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

          <View
            style={{
              width: 390,
              flexDirection: "row",
              marginBottom: layout.padding_x1,
              flexWrap: "wrap",
            }}
          >
            {tags.map((tag, index) => (
              <View
                style={{
                  width: "fit-content",
                  height: "fit-content",
                  borderColor: neutral44,
                  borderWidth: 1,
                  borderRadius: 6,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: layout.padding_x1,
                  marginBottom: layout.padding_x1,
                }}
                key={index}
              >
                <BrandText
                  style={[
                    {
                      color: neutral77,
                      paddingRight: layout.padding_x1,
                      paddingLeft: layout.padding_x1,
                      paddingBottom: layout.padding_x0_25,
                      paddingTop: layout.padding_x0_25,
                    },
                    fontSemibold12,
                  ]}
                >
                  {tag}
                </BrandText>
              </View>
            ))}
          </View>

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
            Reason to do this challenge :
          </BrandText>

          <View style={{ width: 350 }}>
            <BrandText
              style={[
                { color: "white", marginBottom: layout.padding_x0_5 },
                fontSemibold13,
              ]}
            >
              This challenge is part of Season #0 of Pathwar, the decentralized
              training center for hackers willing to join the forces involved in
              the security of the Cosmos ecosystem.
              {"\n"}Beginners welcome, it's time to learn.
            </BrandText>
          </View>

          <View style={{ width: "100%" }}>
            <TertiaryBox
              height={42}
              differentSquaresColor
              leftSquaresBackgroundColor={neutral17}
              rightSquaresBackgroundColor={neutral17}
              style={{ marginTop: layout.padding_x1_5, alignSelf: "center" }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  width: "fit-content",
                  paddingLeft: layout.padding_x3_5,
                  paddingRight: layout.padding_x3_5,
                }}
              >
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <BrandText
                      style={[
                        { color: neutral77, marginRight: layout.padding_x2 },
                        fontSemibold13,
                      ]}
                    >
                      Reward
                    </BrandText>
                    <BrandText
                      style={[
                        {
                          color: secondaryColor,
                          marginLeft: layout.padding_x0_5,
                        },
                        fontSemibold12,
                      ]}
                    >
                      ${reward}
                    </BrandText>
                    <SVG
                      source={pwn}
                      width={30}
                      height={30}
                      style={{ marginBottom: layout.padding_x0_25 }}
                    />
                  </View>
                </View>
              </View>
            </TertiaryBox>
          </View>
        </View>
      </View>
    </TertiaryBox>
  );
};
