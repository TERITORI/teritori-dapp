import React from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {BrandText} from "../../BrandText";
import {fontSemibold14, fontSemibold20} from "../../../utils/style/fonts";
import {neutral00, neutral22, neutral33, neutral77, primaryColor} from "../../../utils/style/colors";
import chevronRightSVG from "../../../../assets/icons/chevron-right.svg";
import {SVG} from "../../SVG";
import {LinearGradient} from "expo-linear-gradient";

export const ProfileHeader: React.FC = () => {
  return (
    <View
      style={{
        marginTop: 24,
        flexDirection: "column",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => {}}
          >
            <BrandText style={currentStyle.circle}>1</BrandText>
            <BrandText style={[fontSemibold14, currentStyle.text]}>
              Personal Info
            </BrandText>
          </TouchableOpacity>
          <SVG
            source={chevronRightSVG}
            style={{ width: 15, margin: "0 20" }}
            color={neutral77}
          />
          <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => {}}
          >
            <BrandText style={nextStyle.circle}>2</BrandText>
            <BrandText style={[fontSemibold14, nextStyle.text]}>
              Professional Info
            </BrandText>
          </TouchableOpacity>
          <SVG
            source={chevronRightSVG}
            style={{ width: 15, margin: "0 20" }}
            color={neutral77}
          />
          <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => {}}
          >
            <BrandText style={nextStyle.circle}>3</BrandText>
            <BrandText style={[fontSemibold14, nextStyle.text]}>
              Linked Accounts
            </BrandText>
          </TouchableOpacity>
          <SVG
            source={chevronRightSVG}
            style={{ width: 15, margin: "0 20" }}
            color={neutral77}
          />
          <TouchableOpacity
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => {}}
          >
            <BrandText style={nextStyle.circle}>4</BrandText>
            <BrandText style={[fontSemibold14, nextStyle.text]}>
              Account Security
            </BrandText>
          </TouchableOpacity>
        <View style={{right: 30, position: "absolute", width: 205, flexDirection: "column"}}>
          <View style={{flexDirection:"row", justifyContent: "space-between"}}>
            <BrandText style={[fontSemibold14]}>Completion Rate</BrandText>
            <BrandText style={[fontSemibold14]}>35%</BrandText>
          </View>
          <View
            style={{
              height: 2,
              borderRadius: 6,
              backgroundColor: neutral33,
              marginTop: 12
            }}
          >
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ height: "100%", width: "30%", borderRadius: 24 }}
              colors={["#5433FF", "#20BDFF", "#A5FECB"]}
            />
          </View>
        </View>
        </View>
      <View
        style={{
          width: "100%",
          height: 1,
          backgroundColor: neutral33,
          marginTop: 24,
          marginBottom: 24,
        }}
      />
    </View>
  )
}

const currentStyle = StyleSheet.create({
  circle: {
    width: 40,
    height: 40,
    lineHeight: 40,
    borderRadius: 20,
    backgroundColor: primaryColor,
    color: neutral00,
    textAlign: "center",
    marginRight: 12,
    fontSize: 16,
  },
  text: { color: primaryColor },
});

const nextStyle = StyleSheet.create({
  circle: {
    width: 40,
    height: 40,
    lineHeight: 40,
    borderRadius: 20,
    backgroundColor: neutral22,
    color: neutral77,
    textAlign: "center",
    marginRight: 12,
    fontSize: 16,
  },
  text: { color: neutral77 },
});
