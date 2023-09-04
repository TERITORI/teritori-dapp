import React, { useState } from "react";
import { View } from "react-native";
import { RadioButton } from "react-native-paper";

import xIcon from "../../../../../assets/icons/Xicon.svg";
import checkIcon from "../../../../../assets/icons/blue-check.svg";
import {
  neutral00,
  neutral33,
  neutralA3,
  secondaryColor,
} from "../../../../utils/style/colors";
import { fontMedium14, fontSemibold16 } from "../../../../utils/style/fonts";
import { BrandText } from "../../../BrandText";
import { SVG } from "../../../SVG";
import { SecondaryButton } from "../../../buttons/SecondaryButton";
import { ServiceLevel } from "../../types/fields";

export const LogoDesignDetailsTab: React.FC<{
  serviceLevels: ServiceLevel[];
}> = ({ serviceLevels }) => {
  const [checked, setChecked] = useState<boolean>();

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
        {serviceLevels.map((service, index) => (
          <View
            key={index}
            style={{ width: "25%", borderColor: neutral33, borderWidth: 0.5 }}
          >
            <BrandText
              style={[
                fontSemibold16,
                { color: neutralA3, marginTop: 8, marginLeft: 8 },
              ]}
            >
              {service.price.value} {service.price.currency}
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
              {service.text}
            </BrandText>
          </View>
        ))}
      </View>
      {serviceLevels.length >= 2 &&
        serviceLevels[2].included.map((serviceText: any, index: number) => (
          <View key={index} style={{ flexDirection: "row" }}>
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
                {serviceText}
              </BrandText>
            </View>
            {serviceLevels.map((serviceLevel, index) => (
              <View
                key={index}
                style={{
                  width: "25%",
                  borderColor: neutral33,
                  borderWidth: 0.5,
                  justifyContent: "center",
                }}
              >
                <SVG
                  source={
                    serviceLevel.included.includes(serviceText)
                      ? checkIcon
                      : xIcon
                  }
                  width={16}
                  height={16}
                  style={{ marginLeft: 8 }}
                />
              </View>
            ))}
          </View>
        ))}
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
        {serviceLevels.map((serviceLevel, index) => (
          <View
            key={index}
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
              {serviceLevel.maximumRevisions === "-1"
                ? "Unlimited"
                : serviceLevel.maximumRevisions}
            </BrandText>
          </View>
        ))}
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
              status={checked ? "checked" : "unchecked"}
              onPress={() => setChecked(true)}
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
              status={checked ? "checked" : "unchecked"}
              onPress={() => setChecked(true)}
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
              status={checked ? "checked" : "unchecked"}
              onPress={() => setChecked(true)}
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
              status={checked ? "checked" : "unchecked"}
              onPress={() => setChecked(true)}
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
              status={checked ? "checked" : "unchecked"}
              onPress={() => setChecked(true)}
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
              status={checked ? "checked" : "unchecked"}
              onPress={() => setChecked(true)}
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
        {serviceLevels.map((serviceLevel, index) => (
          <View
            key={index}
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
              {serviceLevel.price.value} {serviceLevel.price.currency}
            </BrandText>
            <SecondaryButton
              onPress={() => {
                console.log("TODO Navigate to service level", index);
              }}
              size="M"
              text="Select"
              backgroundColor={secondaryColor}
              color={neutral00}
              width={165}
              style={{ marginBottom: 8 }}
            />
          </View>
        ))}
      </View>
    </View>
  );
};
