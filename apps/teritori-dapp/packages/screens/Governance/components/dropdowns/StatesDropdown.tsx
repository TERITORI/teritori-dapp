import React, { useState } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";

import chevronDownSVG from "@/assets/icons/chevron-down.svg";
import chevronUpSVG from "@/assets/icons/chevron-up.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn } from "@/components/spacer";
import { useDropdowns } from "@/hooks/useDropdowns";
import { neutral33, neutral55, secondaryColor } from "@/utils/style/colors";
import { fontMedium14, fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { ProposalStatus } from "@/utils/types/gov";
import { objectKeys } from "@/utils/typescript";

const def = {
  all: {
    name: "All states",
    filter: undefined,
  },
  voting: {
    name: "Voting",
    filter: "PROPOSAL_STATUS_DEPOSIT_PERIOD",
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
  isMobile: boolean;
}

export const StatesDropdown = ({
  style,
  onChange,
  isMobile,
}: StatesDropdownGovProps) => {
  const [isDropdownOpen, setDropdownState, ref] = useDropdowns();
  const [selected, setSelected] = useState<keyof typeof def>("all");

  return (
    <View
      style={[
        {
          zIndex: 1,
          width: isMobile ? "auto" : 148,
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
          width: "100%",
          minWidth: 150,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: layout.spacing_x1_5,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              width: "100%",
              height: 40,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flex: 1,
            }}
            activeOpacity={1}
            onPress={() =>
              isDropdownOpen ? setDropdownState(false) : setDropdownState(true)
            }
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
                minWidth: 148,
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

              {objectKeys(def).map((key, index) => {
                return (
                  <TouchableOpacity
                    key={key}
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

                    {objectKeys(def).length - 1 !== index && (
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
