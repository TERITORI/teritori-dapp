import React, { useState } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";

import chevronDownSVG from "./../../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "./../../../../../assets/icons/chevron-up.svg";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn } from "@/components/spacer";
import { useDropdowns } from "@/hooks/useDropdowns";
import { neutral33, neutral55, secondaryColor } from "@/utils/style/colors";
import { fontMedium14, fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { ProposalStatus } from "@/utils/types/gov";

const def = {
  all: {
    name: "States in Period",
    filter: undefined,
  },
  voting: {
    name: "Voting",
    filter: "PROPOSAL_STATUS_VOTING",
  },
  passed: {
    name: "Passed",
    filter: "PROPOSAL_STATUS_PASSED",
  },
  rejected: {
    name: "Rejected",
    filter: "PROPOSAL_STATUS_REJECTED",
  },
};

interface StatesDropdownGovProps {
  style?: ViewStyle;
  onChange: (filter?: ProposalStatus) => void;
}

export const StatesDropdown = ({ style, onChange }: StatesDropdownGovProps) => {
  const [isDropdownOpen, setDropdownState, ref] = useDropdowns();
  const [selected, setSelected] = useState<keyof typeof def>("all");

  return (
    <View
      style={[
        {
          zIndex: 1,
          width: 148,
        },
        style,
      ]}
      ref={ref}
    >
      <View
        style={{
          backgroundColor: neutral33,
          borderWidth: 1,
          borderRadius: 8,
        }}
      >
        <View
          style={{
            width: "100%",
            height: 40,
            flexDirection: "row",
            paddingHorizontal: layout.spacing_x1_5,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flex: 1,
            }}
            activeOpacity={1}
            onPress={() => setDropdownState()}
          >
            <BrandText
              style={[
                fontMedium14,
                {
                  marginRight: layout.spacing_x1,
                  color: secondaryColor,
                },
              ]}
            >
              {def[selected].name}
            </BrandText>
            <SVG
              source={isDropdownOpen ? chevronUpSVG : chevronDownSVG}
              width={16}
              height={16}
              color={secondaryColor}
            />
          </TouchableOpacity>
          {isDropdownOpen && (
            <View
              style={{
                position: "absolute",
                top: 35,
                right: 0,
                width: "100%",
                paddingHorizontal: layout.spacing_x1_5,
                paddingBottom: layout.spacing_x1,
                backgroundColor: neutral33,
                borderBottomEndRadius: 8,
                borderBottomLeftRadius: 8,
                alignItems: "flex-start",
                zIndex: 1,
              }}
            >
              <Separator
                color={neutral55}
                style={{ marginTop: layout.spacing_x1 }}
              />

              {getKeys(def).map((key, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      onChange(def[key].filter as any);
                      setSelected(key);
                      setDropdownState(false);
                    }}
                    style={{
                      paddingTop: layout.spacing_x1_5,
                      width: "100%",
                    }}
                  >
                    <BrandText
                      style={[fontSemibold14, { color: secondaryColor }]}
                    >
                      {def[key].name}
                    </BrandText>

                    {getKeys(def).length - 1 !== index && (
                      <>
                        <SpacerColumn size={1} />
                        <Separator color={neutral55} />
                      </>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
const getKeys = Object.keys as <T extends object>(obj: T) => (keyof T)[];
