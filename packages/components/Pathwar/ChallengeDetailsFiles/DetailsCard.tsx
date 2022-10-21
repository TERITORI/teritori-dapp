import React from "react";
import { AiOutlineCheck, AiFillStar } from "react-icons/ai";
import { BsFillDiamondFill } from "react-icons/bs";
import { HiClock } from "react-icons/hi";
import { View, TouchableOpacity, StyleProp, ViewStyle } from "react-native";

import TerritoriLogo from "../../../../assets/favicon.png";
import { neutral44 } from "../../../utils/style/colors";
import { BrandText } from "../../BrandText/BrandText";
import { TertiaryBox } from "../../boxes/TertiaryBox";

const Separator: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
  <View
    style={[
      { borderBottomWidth: 1, borderColor: neutral44, width: "100%" },
      style,
    ]}
  />
);

export const DetailsCard: React.FC<{
  title: string;
  description: string;
  tags: string[];
}> = ({ title, description, tags }) => {
  return (
    <TertiaryBox
      width={630}
      height={330}
      mainContainerStyle={{ backgroundColor: "#171717" }}
      style={{ marginBottom: 20 }}
    >
      <View style={{ display: "flex", flexDirection: "column", right: 205 }}>
        <TertiaryBox
          width={196}
          height={196}
          differentSquaresColor
          leftSquaresBackgroundColor="#171717"
          rightSquaresBackgroundColor="#171717"
        >
          {/* img */}
        </TertiaryBox>
        <TertiaryBox
          width={196}
          height={47}
          differentSquaresColor
          leftSquaresBackgroundColor="#171717"
          rightSquaresBackgroundColor="#171717"
          style={{ marginTop: 10 }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: 170,
            }}
          >
            <BrandText style={{ color: "#777777", fontSize: 13 }}>
              Price
            </BrandText>
            <BrandText style={{ color: "#FFFFFF", fontSize: 13 }}>
              5,000 TORI
            </BrandText>
          </View>
        </TertiaryBox>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <TouchableOpacity>
            <TertiaryBox
              width={104}
              height={40}
              differentSquaresColor
              leftSquaresBackgroundColor="#171717"
              rightSquaresBackgroundColor="#171717"
              mainContainerStyle={{ backgroundColor: "white" }}
            >
              <BrandText style={{ color: "black", fontSize: 14 }}>
                Buy
              </BrandText>
            </TertiaryBox>
          </TouchableOpacity>
          <TertiaryBox
            width={80}
            height={40}
            differentSquaresColor
            leftSquaresBackgroundColor="#171717"
            rightSquaresBackgroundColor="#171717"
            mainContainerStyle={{ borderColor: "white" }}
          >
            <BrandText style={{ color: "white", fontSize: 14 }}>More</BrandText>
          </TertiaryBox>
        </View>
      </View>

      <View
        style={{
          flexDirection: "column",
          left: 220,
          top: 20,
          position: "absolute",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
            width: 390,
          }}
        >
          <View style={{ flexDirection: "column" }}>
            <BrandText style={{ color: "white", fontSize: 16 }}>
              {title}
            </BrandText>
            <BrandText style={{ color: "#777777", fontSize: 13, marginTop: 5 }}>
              {description}
            </BrandText>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <View
              style={{
                backgroundColor: "#C8FFAE1A",
                width: 56,
                height: 28,
                borderRadius: 100,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
            >
              <BrandText style={{ color: "#C8FFAE", fontSize: 13 }}>
                Easy
              </BrandText>
            </View>
            <View
              style={{
                backgroundColor: "#777777",
                width: 56,
                height: 28,
                borderRadius: 100,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BrandText style={{ color: "white", fontSize: 13 }}>
                Open
              </BrandText>
            </View>
          </View>
        </View>
        <Separator
          style={{
            marginBottom: 15,
            width: 390,
          }}
        />

        <View
          style={{
            width: 390,
            flexDirection: "row",
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          {tags.map((tag, index) => (
            <View
              style={{
                width: "fit-content",
                height: 24,
                borderColor: "#444444",
                borderWidth: 1,
                borderRadius: 6,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 8,
                marginBottom: 8,
              }}
              key={index}
            >
              <BrandText style={{ color: "#777777", fontSize: 12 }}>
                {"  " + tag + "  "}
              </BrandText>
            </View>
          ))}
        </View>

        <Separator
          style={{
            marginBottom: 10,
            width: 390,
          }}
        />

        <BrandText style={{ fontSize: 13, color: "#777777", marginBottom: 5 }}>
          Statistics about this challenge:
        </BrandText>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            width: "98%",
            justifyContent: "space-between",
          }}
        >
          <View>
            <View style={{ flexDirection: "row", marginBottom: 7 }}>
              <AiOutlineCheck color="#FFFFFF" />
              <BrandText
                style={{ fontSize: 12, color: "#FFFFFF", marginLeft: 10 }}
              >
                2458 pirates solved it
              </BrandText>
            </View>

            <View style={{ flexDirection: "row" }}>
              <AiFillStar color="#FFFFFF" />
              <BrandText
                style={{ fontSize: 12, color: "#FFFFFF", marginLeft: 10 }}
              >
                Current Star pirate is{" "}
                <BrandText style={{ color: "#16BBFF", fontSize: 12 }}>
                  x0x0_{" "}
                </BrandText>
              </BrandText>
            </View>
          </View>

          <View>
            <View style={{ flexDirection: "row", marginBottom: 7 }}>
              <HiClock color="#FFFFFF" />
              <BrandText
                style={{ fontSize: 12, color: "#FFFFFF", marginLeft: 10 }}
              >
                Average duration: 4’42
              </BrandText>
            </View>

            <View style={{ flexDirection: "row" }}>
              <BsFillDiamondFill color="#FFFFFF" />
              <BrandText
                style={{ fontSize: 12, color: "#FFFFFF", marginLeft: 10 }}
              >
                Related booty
              </BrandText>
            </View>
          </View>
        </View>

        <TertiaryBox
          width={393}
          height={67}
          differentSquaresColor
          leftSquaresBackgroundColor="#171717"
          rightSquaresBackgroundColor="#171717"
          style={{ marginTop: 10 }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: 370,
            }}
          >
            <View>
              <View style={{ flexDirection: "row", marginBottom: 7 }}>
                <BrandText style={{ fontSize: 12, color: "#FFFFFF" }}>
                  Top #1:{" "}
                  <BrandText style={{ color: "#16BBFF", fontSize: 12 }}>
                    x0x0_{" "}
                  </BrandText>
                </BrandText>
              </View>

              <View style={{ flexDirection: "row" }}>
                <BrandText style={{ fontSize: 12, color: "#FFFFFF" }}>
                  Top #3:{" "}
                  <BrandText style={{ color: "#16BBFF", fontSize: 12 }}>
                    x0x0_{" "}
                  </BrandText>
                </BrandText>
              </View>
            </View>

            <View>
              <View style={{ flexDirection: "row", marginBottom: 7 }}>
                <BrandText style={{ fontSize: 12, color: "#FFFFFF" }}>
                  Top #2:{" "}
                  <BrandText style={{ color: "#16BBFF", fontSize: 12 }}>
                    x0x0_{" "}
                  </BrandText>
                </BrandText>
              </View>

              <View style={{ flexDirection: "row" }}>
                <BrandText style={{ fontSize: 12, color: "#FFFFFF" }}>
                  50
                </BrandText>
                <img
                  src={TerritoriLogo}
                  style={{ width: 15, height: 15, marginLeft: 4 }}
                />
                <BrandText
                  style={{ fontSize: 12, color: "#FFFFFF", marginLeft: 4 }}
                >
                  Rewards
                </BrandText>
              </View>
            </View>
          </View>
        </TertiaryBox>
      </View>
    </TertiaryBox>
  );
};
