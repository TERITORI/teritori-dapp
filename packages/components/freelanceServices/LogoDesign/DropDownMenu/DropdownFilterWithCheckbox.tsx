import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import { FilterOptionType } from "../../../../screens/FreelanceServices/types/fields";
import {
  neutral00,
  neutral77,
  primaryColor,
  secondaryColor,
} from "../../../../utils/style/colors";
import { fontSemibold14 } from "../../../../utils/style/fonts";
import { BrandText } from "../../../BrandText";
import { Separator } from "../../../Separator";
import { TertiaryBox } from "../../../boxes/TertiaryBox";
import { SecondaryButton } from "../../../buttons/SecondaryButton";

export const DropdownFilterWithCheckbox: React.FC<{
  initOptions: FilterOptionType[];
}> = ({ initOptions }) => {
  const [options, setOptions] = useState(initOptions);
  const [showCount, setShowCount] = useState(4);

  return (
    <TertiaryBox
      style={{ position: "absolute", top: 60 }}
      mainContainerStyle={{ borderColor: secondaryColor }}
    >
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          marginLeft: 32,
          marginTop: 20,
          marginBottom: 12,
        }}
      >
        {options.map((option, groupIndex) => {
          return (
            <View key={groupIndex}>
              <BrandText style={[fontSemibold14, { marginBottom: 12 }]}>
                {option.text}
              </BrandText>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <FlatList
                  data={option.checkables.slice(0, showCount)}
                  numColumns={2}
                  renderItem={({ item, index }) => (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <Checkbox
                        color={item.checked ? primaryColor : secondaryColor}
                        value={item.checked}
                        onValueChange={() => {
                          options[groupIndex].checkables[index].checked =
                            !options[groupIndex].checkables[index].checked;
                          setOptions([...options]);
                        }}
                      />
                      <BrandText
                        style={[
                          fontSemibold14,
                          { marginRight: 6, marginLeft: 6, width: 220 },
                        ]}
                      >
                        {item.text}
                        {item.count ? (
                          <BrandText
                            style={[
                              { color: neutral77, marginLeft: 6 },
                              fontSemibold14,
                            ]}
                          >
                            ({item.count})
                          </BrandText>
                        ) : undefined}
                      </BrandText>
                    </View>
                  )}
                  keyExtractor={(item) => item.text}
                />
              </View>
              {option.checkables.length > 4 &&
              option.checkables.length > showCount ? (
                <TouchableOpacity
                  onPress={() => {
                    setShowCount(option.checkables.length);
                  }}
                >
                  <BrandText style={[fontSemibold14, { color: primaryColor }]}>
                    +{option.checkables.length} More
                  </BrandText>
                </TouchableOpacity>
              ) : null}

              <Separator
                style={{
                  width: "95%",
                  alignSelf: "center",
                  marginTop: 12,
                  marginRight: 32,
                  marginBottom: 12,
                }}
              />
            </View>
          );
        })}
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
          marginBottom: 20,
        }}
      >
        <SecondaryButton
          size="SM"
          text="Clear All"
          onPress={() => {
            setOptions([...initOptions]); // reset
          }}
        />
        <SecondaryButton
          size="SM"
          text="Apply"
          backgroundColor={primaryColor}
          color={neutral00}
        />
      </View>
    </TertiaryBox>
  );
};
