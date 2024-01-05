import React, { useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
  useWindowDimensions,
  ViewStyle,
} from "react-native";

import avaPNG from "../../../../assets/default-images/ava.png";
import guardianPng from "../../../../assets/default-images/guardian_1.png";
import addCircleSVG from "../../../../assets/icons/add-circle.svg";
import checkBadgeSVG from "../../../../assets/icons/check-badge.svg";
import dotSVG from "../../../../assets/icons/dot-more.svg";
import downSVG from "../../../../assets/icons/down.svg";
import trashSVG from "../../../../assets/icons/trash-white.svg";
import upSVG from "../../../../assets/icons/up.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { Box, BoxStyle } from "../../../components/boxes/Box";
import { SearchInput } from "../../../components/sorts/SearchInput";
import {
  neutral33,
  neutral00,
  gradientColorLightBlue,
} from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "../../../utils/style/fonts";

const MD_BREAKPOINT = 820;

export const GuardiansBox = () => {
  const { width } = useWindowDimensions();

  const [guardiansHandler, setGuardiansHandler] = useState<number[]>([1, 2]);
  const [isListOpen, setIsListOpen] = useState<number>();

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
              <Box notched style={herosLisBox}>
                <TouchableOpacity
                  onPress={() =>
                    setIsListOpen((old) => (old === index ? -1 : index))
                  }
                  style={toggleBox}
                >
                  <BrandText style={[fontSemibold14]}>
                    Genesis Guardians
                  </BrandText>
                  <View>
                    {isListOpen === index ? (
                      <SVG source={downSVG} />
                    ) : (
                      <SVG source={upSVG} />
                    )}
                  </View>
                </TouchableOpacity>
                {isListOpen === index ? (
                  <Box
                    notched
                    style={{
                      height: 250,
                      width: "100%",
                      borderWidth: 1,
                      borderColor: gradientColorLightBlue,
                    }}
                  >
                    <View style={{ margin: 10 }}>
                      <SearchInput
                        handleChangeText={() => {}} //TODO: don't forget to rewrite onPress function if possible
                      />
                      <FlatList
                        showsVerticalScrollIndicator={false}
                        data={Array(10).fill(0)}
                        renderItem={({ item }) => (
                          <View style={listToggle}>
                            <Image
                              style={{
                                width: 28,
                                height: 28,
                              }}
                              source={avaPNG}
                            />
                            <BrandText
                              style={[
                                fontSemibold16,
                                { marginLeft: 15, marginRight: 10 },
                              ]}
                            >
                              Meebits
                            </BrandText>
                            <SVG source={checkBadgeSVG} />
                          </View>
                        )}
                        keyExtractor={(item) => item.id}
                        style={{
                          marginTop: 12,
                          marginLeft: 5,
                        }}
                        contentContainerStyle={{
                          height: 180,
                        }}
                      />
                    </View>
                  </Box>
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
              </Box>
            </View>
          </>
        );
      })}
      {guardiansHandler?.length < 5 ? (
        <Box
          notched
          style={{
            width: width >= MD_BREAKPOINT ? "19%" : "100%",
            marginTop: 52,
            borderWidth: 1,
            borderColor: neutral33,
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
        </Box>
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
  borderWidth: 1,
  borderColor: neutral33,
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
  height: 250,
  width: "100%",
};

const listToggle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginVertical: 5,
};
