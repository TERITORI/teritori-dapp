import React, { useState } from "react";
import { View } from "react-native";
import { RadioButton } from "react-native-paper";

import checkIcon from "../../../../../assets/icons/blue-check.svg";
import {
  secondaryColor,
  neutral00,
  neutralA3,
  neutral33,
} from "../../../../utils/style/colors";
import { fontMedium14, fontSemibold16 } from "../../../../utils/style/fonts";
import { BrandText } from "../../../BrandText/BrandText";
import { SVG } from "../../../SVG";
import { SecondaryButton } from "../../../buttons/SecondaryButton";

export const LogoDesignDetailsTab: React.FC = () => {
  const [checked, setChecked] = useState("nothingChecked");

  return (
    <View style={{ width: "100%", flexDirection: "column" }}>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            borderTopLeftRadius: 8,
            paddingBottom: 16,
          }}
        >
          <BrandText
            style={[
              fontMedium14,
              {
                color: neutral33,
                marginTop: 8,
                marginLeft: 8,
                marginBottom: 8,
              },
            ]}
          >
            Package
          </BrandText>
        </View>
        <View
          style={{ width: "25%", borderColor: neutral33, borderWidth: 0.5 }}
        >
          <BrandText
            style={[
              fontSemibold16,
              { color: neutralA3, marginTop: 8, marginLeft: 8 },
            ]}
          >
            500 TORI
          </BrandText>
          <BrandText
            style={[
              fontSemibold16,
              {
                color: neutralA3,
                marginTop: 8,
                marginLeft: 8,
                marginBottom: 8,
              },
            ]}
          >
            Basic
          </BrandText>
        </View>
        <View
          style={{ width: "25%", borderColor: neutral33, borderWidth: 0.5 }}
        >
          <BrandText
            style={[
              fontSemibold16,
              { color: neutralA3, marginTop: 8, marginLeft: 8 },
            ]}
          >
            100 TORI
          </BrandText>
          <BrandText
            style={[
              fontSemibold16,
              {
                color: neutralA3,
                marginTop: 8,
                marginLeft: 8,
                marginBottom: 8,
              },
            ]}
          >
            Standard
          </BrandText>
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            borderTopRightRadius: 8,
          }}
        >
          <BrandText
            style={[
              fontSemibold16,
              { color: neutralA3, marginTop: 8, marginLeft: 8 },
            ]}
          >
            1500 TORI
          </BrandText>
          <BrandText
            style={[
              fontSemibold16,
              {
                color: neutralA3,
                marginTop: 8,
                marginLeft: 8,
                marginBottom: 8,
              },
            ]}
          >
            Premium
          </BrandText>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{ width: "25%", borderColor: neutral33, borderWidth: 0.5 }}
        >
          <BrandText
            style={[
              fontMedium14,
              {
                color: neutral33,
                marginTop: 8,
                marginLeft: 8,
                marginBottom: 8,
              },
            ]}
          >
            Logo Transparency
          </BrandText>
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <SVG
            source={checkIcon}
            width={16}
            height={16}
            style={{ marginLeft: 8 }}
          />
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <SVG
            source={checkIcon}
            width={16}
            height={16}
            style={{ marginLeft: 8 }}
          />
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <SVG
            source={checkIcon}
            width={16}
            height={16}
            style={{ marginLeft: 8 }}
          />
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{ width: "25%", borderColor: neutral33, borderWidth: 0.5 }}
        >
          <BrandText
            style={[
              fontMedium14,
              {
                color: neutral33,
                marginTop: 8,
                marginLeft: 8,
                marginBottom: 8,
              },
            ]}
          >
            Vector file
          </BrandText>
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <SVG
            source={checkIcon}
            width={16}
            height={16}
            style={{ marginLeft: 8 }}
          />
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <SVG
            source={checkIcon}
            width={16}
            height={16}
            style={{ marginLeft: 8 }}
          />
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <SVG
            source={checkIcon}
            width={16}
            height={16}
            style={{ marginLeft: 8 }}
          />
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{ width: "25%", borderColor: neutral33, borderWidth: 0.5 }}
        >
          <BrandText
            style={[
              fontMedium14,
              {
                color: neutral33,
                marginTop: 8,
                marginLeft: 8,
                marginBottom: 8,
              },
            ]}
          >
            Printable file
          </BrandText>
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <SVG
            source={checkIcon}
            width={16}
            height={16}
            style={{ marginLeft: 8 }}
          />
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <SVG
            source={checkIcon}
            width={16}
            height={16}
            style={{ marginLeft: 8 }}
          />
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <SVG
            source={checkIcon}
            width={16}
            height={16}
            style={{ marginLeft: 8 }}
          />
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{ width: "25%", borderColor: neutral33, borderWidth: 0.5 }}
        >
          <BrandText
            style={[
              fontMedium14,
              {
                color: neutral33,
                marginTop: 8,
                marginLeft: 8,
                marginBottom: 8,
              },
            ]}
          >
            3d mockup
          </BrandText>
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <SVG
            source={checkIcon}
            width={16}
            height={16}
            style={{ marginLeft: 8 }}
          />
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <SVG
            source={checkIcon}
            width={16}
            height={16}
            style={{ marginLeft: 8 }}
          />
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <SVG
            source={checkIcon}
            width={16}
            height={16}
            style={{ marginLeft: 8 }}
          />
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{ width: "25%", borderColor: neutral33, borderWidth: 0.5 }}
        >
          <BrandText
            style={[
              fontMedium14,
              {
                color: neutral33,
                marginTop: 8,
                marginLeft: 8,
                marginBottom: 8,
              },
            ]}
          >
            Source file
          </BrandText>
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <SVG
            source={checkIcon}
            width={16}
            height={16}
            style={{ marginLeft: 8 }}
          />
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <SVG
            source={checkIcon}
            width={16}
            height={16}
            style={{ marginLeft: 8 }}
          />
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <SVG
            source={checkIcon}
            width={16}
            height={16}
            style={{ marginLeft: 8 }}
          />
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{ width: "25%", borderColor: neutral33, borderWidth: 0.5 }}
        >
          <BrandText
            style={[
              fontMedium14,
              {
                color: neutral33,
                marginTop: 8,
                marginLeft: 8,
                marginBottom: 8,
              },
            ]}
          >
            Stationary
          </BrandText>
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <SVG
            source={checkIcon}
            width={16}
            height={16}
            style={{ marginLeft: 8 }}
          />
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <SVG
            source={checkIcon}
            width={16}
            height={16}
            style={{ marginLeft: 8 }}
          />
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <SVG
            source={checkIcon}
            width={16}
            height={16}
            style={{ marginLeft: 8 }}
          />
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{ width: "25%", borderColor: neutral33, borderWidth: 0.5 }}
        >
          <BrandText
            style={[
              fontMedium14,
              {
                color: neutral33,
                marginTop: 8,
                marginLeft: 8,
                marginBottom: 8,
              },
            ]}
          >
            Social media kit
          </BrandText>
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <SVG
            source={checkIcon}
            width={16}
            height={16}
            style={{ marginLeft: 8 }}
          />
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <SVG
            source={checkIcon}
            width={16}
            height={16}
            style={{ marginLeft: 8 }}
          />
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <SVG
            source={checkIcon}
            width={16}
            height={16}
            style={{ marginLeft: 8 }}
          />
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{ width: "25%", borderColor: neutral33, borderWidth: 0.5 }}
        >
          <BrandText
            style={[
              fontMedium14,
              {
                color: neutral33,
                marginTop: 8,
                marginLeft: 8,
                marginBottom: 8,
              },
            ]}
          >
            Revisions
          </BrandText>
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <BrandText
            style={[fontSemibold16, { color: neutralA3, marginLeft: 8 }]}
          >
            3
          </BrandText>
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <BrandText
            style={[fontSemibold16, { color: neutralA3, marginLeft: 8 }]}
          >
            4
          </BrandText>
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            justifyContent: "center",
          }}
        >
          <BrandText
            style={[fontSemibold16, { color: neutralA3, marginLeft: 8 }]}
          >
            Unlimited
          </BrandText>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{ width: "25%", borderColor: neutral33, borderWidth: 0.5 }}
        >
          <BrandText
            style={[
              fontMedium14,
              { color: neutral33, marginTop: 8, marginLeft: 8 },
            ]}
          >
            Delivery
          </BrandText>
        </View>
        <View
          style={{ width: "25%", borderColor: neutral33, borderWidth: 0.5 }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <BrandText
              style={[fontSemibold16, { color: neutralA3, marginLeft: 8 }]}
            >
              4 days
            </BrandText>
            <RadioButton
              value=""
              color="#16BBFF"
              uncheckedColor="#777777"
              status={checked === "Yes" ? "checked" : "unchecked"}
              onPress={() => setChecked("Yes")}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <BrandText
              style={[fontSemibold16, { color: neutralA3, marginLeft: 8 }]}
            >
              2 days + 500 TORI
            </BrandText>
            <RadioButton
              value=""
              color="#16BBFF"
              uncheckedColor="#777777"
              status={checked === "Yes" ? "checked" : "unchecked"}
              onPress={() => setChecked("Yes")}
            />
          </View>
        </View>
        <View
          style={{ width: "25%", borderColor: neutral33, borderWidth: 0.5 }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <BrandText
              style={[fontSemibold16, { color: neutralA3, marginLeft: 8 }]}
            >
              3 days
            </BrandText>
            <RadioButton
              value=""
              color="#16BBFF"
              uncheckedColor="#777777"
              status={checked === "Yes" ? "checked" : "unchecked"}
              onPress={() => setChecked("Yes")}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <BrandText
              style={[fontSemibold16, { color: neutralA3, marginLeft: 8 }]}
            >
              2 days + 800 TORI
            </BrandText>
            <RadioButton
              value=""
              color="#16BBFF"
              uncheckedColor="#777777"
              status={checked === "Yes" ? "checked" : "unchecked"}
              onPress={() => setChecked("Yes")}
            />
          </View>
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            borderTopRightRadius: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <BrandText
              style={[fontSemibold16, { color: neutralA3, marginLeft: 8 }]}
            >
              3 days
            </BrandText>
            <RadioButton
              value=""
              color="#16BBFF"
              uncheckedColor="#777777"
              status={checked === "Yes" ? "checked" : "unchecked"}
              onPress={() => setChecked("Yes")}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <BrandText
              style={[fontSemibold16, { color: neutralA3, marginLeft: 8 }]}
            >
              2 days + 1300 TORI
            </BrandText>
            <RadioButton
              value=""
              color="#16BBFF"
              uncheckedColor="#777777"
              status={checked === "Yes" ? "checked" : "unchecked"}
              onPress={() => setChecked("Yes")}
            />
          </View>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            borderBottomLeftRadius: 8,
          }}
        >
          <BrandText
            style={[
              fontMedium14,
              { color: neutral33, marginTop: 8, marginLeft: 8 },
            ]}
          >
            Overall
          </BrandText>
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            alignItems: "center",
          }}
        >
          <BrandText
            style={[
              fontSemibold16,
              {
                color: neutralA3,
                alignSelf: "flex-start",
                marginLeft: 12,
                marginBottom: 8,
                marginTop: 16,
              },
            ]}
          >
            500 TORI
          </BrandText>
          <SecondaryButton
            size="M"
            text="Select"
            backgroundColor={secondaryColor}
            color={neutral00}
            width={165}
            style={{ marginBottom: 8 }}
          />
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            alignItems: "center",
          }}
        >
          <BrandText
            style={[
              fontSemibold16,
              {
                color: neutralA3,
                alignSelf: "flex-start",
                marginLeft: 12,
                marginBottom: 8,
                marginTop: 16,
              },
            ]}
          >
            1500 TORI
          </BrandText>
          <SecondaryButton
            size="M"
            text="Select"
            backgroundColor={secondaryColor}
            color={neutral00}
            width={165}
          />
        </View>
        <View
          style={{
            width: "25%",
            borderColor: neutral33,
            borderWidth: 0.5,
            borderBottomRightRadius: 8,
            alignItems: "center",
          }}
        >
          <BrandText
            style={[
              fontSemibold16,
              {
                color: neutralA3,
                alignSelf: "flex-start",
                marginLeft: 12,
                marginBottom: 8,
                marginTop: 16,
              },
            ]}
          >
            3000 TORI
          </BrandText>
          <SecondaryButton
            size="M"
            text="Select"
            backgroundColor={secondaryColor}
            color={neutral00}
            width={165}
          />
        </View>
      </View>
    </View>
  );
};
