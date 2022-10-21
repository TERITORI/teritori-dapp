import React from "react";
import { BiSearch } from "react-icons/bi";
import { View, StyleProp, ViewStyle } from "react-native";

import pathwarBanner from "../../../assets/Banner/pathwarBanner.svg";
import { BrandText } from "../../components/BrandText";
import { ChallengeBox } from "../../components/Pathwar/ChallengeBox";
import { ConnectBar } from "../../components/Pathwar/ConnectBar";
import { NavBarPathwarOverview } from "../../components/Pathwar/NavBarPathwarOverview";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";
import { ScreenFC } from "../../utils/navigation";
import { neutral44 } from "../../utils/style/colors";
import data from "./data.json";

const Separator: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
  <View
    style={[
      { borderBottomWidth: 1, borderColor: neutral44, width: "100%" },
      style,
    ]}
  />
);

export const PathwarScreen: ScreenFC<"Pathwar"> = () => {
  return (
    <ScreenContainer>
      <View
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          margin: "auto",
        }}
      >
        <SVG
          source={pathwarBanner}
          style={{
            width: "100%",
          }}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <ConnectBar />
      </View>
      <NavBarPathwarOverview />

      <Separator style={{ marginTop: 20, marginBottom: 30 }} />

      <View
        style={{
          flexDirection: "column",
          display: "flex",
          alignItems: "center",
          width: "100%",
          marginBottom: 40,
        }}
      >
        <BrandText style={{ fontSize: 28 }}>Challenges</BrandText>
        <View style={{ marginTop: 30 }}>
          <TextInputCustom<{ Search: string }>
            label=""
            name="Search"
            width={400}
            placeHolder="Search..."
            mainBoxBackgroundColor="#000000"
          >
            <View style={{ right: 5 }}>
              <BiSearch color="white" />
            </View>
          </TextInputCustom>
        </View>
      </View>

      <View
        style={{
          display: "flex",
          width: "119%",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          right: 90,
        }}
      >
        {data.items.map((item, index) => (
          <ChallengeBox
            title={item.flavor.slug}
            description={item.flavor.body}
            tags={item.flavor.tags}
            key={index}
          />
        ))}
      </View>
    </ScreenContainer>
  );
};
