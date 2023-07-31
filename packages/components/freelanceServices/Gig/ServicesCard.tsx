import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";

import checkIcon from "../../../../assets/icons/blue-check.svg";
import chevronUp from "../../../../assets/icons/chevron-up.svg";
import chevronDown from "../../../../assets/icons/freelance-service/chevron-down.svg";
import clockIcon from "../../../../assets/icons/grey-clock.svg";
import refreshIcon from "../../../../assets/icons/refresh-grey.svg";
import { useAppNavigation } from "../../../utils/navigation";
import {
  neutral44,
  primaryColor,
  secondaryColor,
  neutral00,
  neutral77,
  neutral33,
} from "../../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold28,
  fontSemibold14,
  fontSemibold16,
} from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { TertiaryBox } from "../../boxes/TertiaryBox";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import { ServiceLevel } from "../types/fields";

export const ServicesCard: React.FC<{
  gigId: string;
  serviceLevels: ServiceLevel[];
}> = ({ gigId, serviceLevels }) => {
  const [selected, setSelected] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const navigation = useAppNavigation();
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
            {serviceLevels
              .map((item) => item.text)
              .map((serviceText, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelected(index);
                  }}
                >
                  <BrandText
                    style={[
                      {
                        borderBottomColor:
                          serviceLevels[selected].text === serviceText
                            ? secondaryColor
                            : neutral00,
                        borderBottomWidth: 2,
                        paddingBottom: 12,
                        width: "fit-content",
                        marginRight: 20,
                      },
                      fontMedium14,
                    ]}
                  >
                    {serviceText}
                  </BrandText>
                </TouchableOpacity>
              ))}
          </View>
        </View>
        <BrandText style={[{ marginTop: 24 }, fontSemibold28]}>
          {serviceLevels[selected].price.value}{" "}
          {serviceLevels[selected].price.currency}
        </BrandText>
        <BrandText
          style={[fontSemibold14, { color: neutral77, marginTop: 24 }]}
        >
          {serviceLevels[selected].description}
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
              {serviceLevels[selected].daysToDelivery} Days Delivery
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
              {serviceLevels[selected].maximumRevisions} Revisions
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
              setOpen(!open);
            }}
          >
            {open ? (
              <SVG source={chevronUp} width={16} height={16} />
            ) : (
              <SVG source={chevronDown} width={16} height={16} />
            )}
          </TouchableOpacity>
        </View>

        {open && (
          <View style={{ flexDirection: "column" }}>
            {serviceLevels[selected].included.map((included, index) => (
              <View key={index} style={{ flexDirection: "row" }}>
                <SVG source={checkIcon} width={24} height={24} />
                <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                  {included}
                </BrandText>
              </View>
            ))}
          </View>
        )}

        <SecondaryButton
          size="SM"
          text="Continue"
          fullWidth
          color={neutral00}
          backgroundColor={primaryColor}
          style={{ marginTop: 12, marginBottom: 16 }}
          onPress={() => {
            navigation.navigate("FreelanceServicesOrder", {
              gigId,
              serviceLevelIndex: selected,
            });
          }}
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
