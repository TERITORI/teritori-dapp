import React, { useState } from "react";
import {
  FlatList,
  ImageBackground,
  TouchableOpacity,
  View,
  useWindowDimensions,
  ViewStyle,
} from "react-native";

import { GuardiansList } from "./GuardiansList";
import guardianPng from "../../../../assets/default-images/guardian_1.png";
import addCircleSVG from "../../../../assets/icons/add-circle.svg";
import dotSVG from "../../../../assets/icons/dot-more.svg";
import downSVG from "../../../../assets/icons/down.svg";
import trashSVG from "../../../../assets/icons/trash-white.svg";
import upSVG from "../../../../assets/icons/up.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { BoxStyle } from "../../../components/boxes/Box";
import { PrimaryBox } from "../../../components/boxes/PrimaryBox";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SearchInput } from "../../../components/sorts/SearchInput";
import { neutral33, neutral00 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";

const MD_BREAKPOINT = 820;

export const GuardiansBox = () => {
  const { width } = useWindowDimensions();

  const [guardiansHandler, setGuardiansHandler] = useState<number[]>([1, 2]);
  const [openedList, setOpenedList] = useState<number>();

  return (
    <View style={{ flexDirection: width >= MD_BREAKPOINT ? "row" : "column" }}>
      {guardiansHandler?.map((d: number, index: number) => {
        return (
          <>
            <View
              style={[
                viewBox,
                { width: width >= MD_BREAKPOINT ? "19%" : "100%" },
              ]}
            >
              <View style={insideBoxMap}>
                <View style={dotBackground}>
                  <BrandText style={[fontSemibold14]}>{index + 1}</BrandText>
                </View>
                <View>
                  <SVG source={dotSVG} />
                </View>
              </View>
              <TertiaryBox style={herosLisBox}>
                <TouchableOpacity
                  onPress={() =>
                    setOpenedList((old) => (old === index ? -1 : index))
                  }
                  style={toggleBox}
                >
                  <BrandText style={[fontSemibold14]}>
                    Genesis Guardians
                  </BrandText>
                  <View>
                    {openedList === index ? (
                      <SVG source={downSVG} />
                    ) : (
                      <SVG source={upSVG} />
                    )}
                  </View>
                </TouchableOpacity>
                {openedList === index ? (
                  <PrimaryBox
                    style={{
                      height: 260,
                      width: "100%",
                    }}
                  >
                    <View style={{ margin: 10 }}>
                      <SearchInput
                        handleChangeText={() => {}} //TODO: don't forget to rewrite onPress function if possible
                      />
                      <FlatList
                        showsVerticalScrollIndicator={false}
                        data={Array(10).fill(0)}
                        renderItem={({ index }) => (
                          <GuardiansList index={index} />
                        )}
                        keyExtractor={(item) => item.id}
                        style={{
                          marginTop: 16,
                          marginLeft: 5,
                        }}
                        contentContainerStyle={{
                          height: 180,
                        }}
                      />
                    </View>
                  </PrimaryBox>
                ) : (
                  <ImageBackground
                    source={guardianPng}
                    imageStyle={{ borderRadius: 16 }}
                    style={imageBgStyle}
                  >
                    <TouchableOpacity style={trashBtnBox}>
                      <SVG source={trashSVG} />
                    </TouchableOpacity>
                  </ImageBackground>
                )}
              </TertiaryBox>
            </View>
          </>
        );
      })}
      {guardiansHandler?.length < 5 ? (
        <TertiaryBox
          style={{
            width: width >= MD_BREAKPOINT ? "19%" : "100%",
            marginTop: 52,
            padding: 12,
            height: 325,
          }}
        >
          <TouchableOpacity
            onPress={() => setGuardiansHandler([...guardiansHandler, 1])}
            style={plusBox}
          >
            <View style={dotBackground}>
              <SVG source={addCircleSVG} />
            </View>
            <BrandText style={[fontSemibold14, { marginLeft: 5 }]}>
              Add more
            </BrandText>
          </TouchableOpacity>
        </TertiaryBox>
      ) : null}
    </View>
  );
};

const dotBackground: ViewStyle = {
  backgroundColor: neutral33,
  height: 35,
  width: 35,
  borderRadius: 100,
  alignItems: "center",
  justifyContent: "center",
};

const trashBtnBox: ViewStyle = {
  backgroundColor: neutral00,
  height: 35,
  width: 35,
  borderRadius: 100,
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  right: 16,
  bottom: 10,
};

const insideBoxMap: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  height: 40,
};

const toggleBox: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
};

const viewBox: ViewStyle = {
  width: "19%",
  marginHorizontal: 8,
};

const herosLisBox: BoxStyle = {
  padding: 12,
  marginTop: 12,
  height: 325,
};

const plusBox: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
};

const imageBgStyle: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
  height: 260,
  width: "100%",
};
