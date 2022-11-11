import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";

import checkIcon from "../../../../../assets/icons/blue-check.svg";
import chevronUp from "../../../../../assets/icons/chevron-up.svg";
import chevronDown from "../../../../../assets/icons/freelance-service/chevron-down.svg";
import clockIcon from "../../../../../assets/icons/grey-clock.svg";
import refreshIcon from "../../../../../assets/icons/refresh-grey.svg";
import { SVG } from "../../../../components/SVG";
import { TertiaryBox } from "../../../../components/boxes/TertiaryBox";
import { SecondaryButton } from "../../../../components/buttons/SecondaryButton";
import {
  neutral44,
  primaryColor,
  secondaryColor,
  neutral00,
  neutral77,
  neutral33,
} from "../../../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold28,
  fontSemibold14,
  fontSemibold16,
} from "../../../../utils/style/fonts";
import { BrandText } from "../../../BrandText/BrandText";

const data = ["Basic", "Standard", "Premium"];

export const SecondaryCard: React.FC = () => {
  const [selected, setSelected] = useState(data[1]);
  const [isDeplayed, setIsDeplayed] = useState(false);
  return (
    <TertiaryBox width={440} style={{ marginTop: 24 }}>
      <View style={{ width: 400, marginTop: 20, flexDirection: "column" }}>
        <View
          style={{
            borderBottomColor: neutral44,
            borderBottomWidth: 1,
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              height: "fit-content",
            }}
          >
            {data.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelected(item);
                }}
              >
                <BrandText
                  style={[
                    {
                      borderBottomColor:
                        selected === item ? secondaryColor : neutral00,
                      borderBottomWidth: 2,
                      paddingBottom: 12,
                      width: "fit-content",
                      marginRight: 20,
                    },
                    fontMedium14,
                  ]}
                >
                  {item}
                </BrandText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <BrandText style={[{ marginTop: 24 }, fontSemibold28]}>
          1500 TORI
        </BrandText>
        <BrandText
          style={[fontSemibold14, { color: neutral77, marginTop: 24 }]}
        >
          4 HQ UltraQuality Logos + AI EPS Vector Source File + 3D Mockup + VIP
          Support + 5 Social Media Covers
        </BrandText>
        <View style={{ flexDirection: "row", marginTop: 24 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: 150,
            }}
          >
            <SVG source={clockIcon} width={24} height={24} color={neutral77} />
            <BrandText
              style={[fontSemibold14, { color: neutral77, marginLeft: 8 }]}
            >
              3 Days Delivery
            </BrandText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <SVG
              source={refreshIcon}
              width={24}
              height={24}
              color={neutral77}
            />
            <BrandText
              style={[fontSemibold14, { color: neutral77, marginLeft: 8 }]}
            >
              5 Revisions
            </BrandText>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            marginTop: 16,
            marginBottom: 12,
          }}
        >
          <BrandText style={fontSemibold16}>What's included</BrandText>
          <TouchableOpacity
            onPress={() => {
              setIsDeplayed(!isDeplayed);
            }}
          >
            {isDeplayed ? (
              <SVG source={chevronDown} width={16} height={16} />
            ) : (
              <SVG source={chevronUp} width={16} height={16} />
            )}
          </TouchableOpacity>
        </View>

        {isDeplayed && (
          <View style={{ flexDirection: "column" }}>
            <View style={{ flexDirection: "row" }}>
              <SVG source={checkIcon} width={24} height={24} />
              <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                4 concepts included
              </BrandText>
            </View>
            <View style={{ flexDirection: "row" }}>
              <SVG source={checkIcon} width={24} height={24} />
              <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                Logo transparency
              </BrandText>
            </View>
            <View style={{ flexDirection: "row" }}>
              <SVG source={checkIcon} width={24} height={24} />
              <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                Vector file
              </BrandText>
            </View>
            <View style={{ flexDirection: "row" }}>
              <SVG source={checkIcon} width={24} height={24} />
              <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                Printable file
              </BrandText>
            </View>
            <View style={{ flexDirection: "row" }}>
              <SVG source={checkIcon} width={24} height={24} />
              <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                Include 3D Mockup
              </BrandText>
            </View>
            <View style={{ flexDirection: "row" }}>
              <SVG source={checkIcon} width={24} height={24} />
              <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                Include source file
              </BrandText>
            </View>
            <View style={{ flexDirection: "row" }}>
              <SVG source={checkIcon} width={24} height={24} />
              <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                Include social media kit
              </BrandText>
            </View>
          </View>
        )}

        <SecondaryButton
          size="SM"
          text="Continue"
          fullWidth
          color={neutral00}
          backgroundColor={primaryColor}
          style={{ marginTop: 12, marginBottom: 16 }}
        />

        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <SecondaryButton
            size="SM"
            text="Compare Packages"
            width={192}
            color={secondaryColor}
            backgroundColor={neutral33}
          />
          <SecondaryButton
            size="SM"
            text="Contact Seller"
            width={192}
            color={neutral00}
            backgroundColor={secondaryColor}
          />
        </View>
      </View>
    </TertiaryBox>
  );
};
