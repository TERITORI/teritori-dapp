import React, { useState } from "react";
import { View, TouchableOpacity, useWindowDimensions } from "react-native";

import { BrandText } from "../../components/BrandText/BrandText";
import { neutral33 } from "../../utils/style/colors";
import { smallMobileWidth } from "../../utils/style/layout";
import { ProposalStatus } from "./types";

export const NavBarGovernance: React.FC<{
  onChange: (filter?: ProposalStatus) => void;
}> = ({ onChange }) => {
  const [selected, setSelected] = useState<keyof typeof def>("all");
  const { width } = useWindowDimensions();

  const def = {
    all: {
      name: width < smallMobileWidth ? "All" : "All Periods",
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

  return (
    <View
      style={{
        top: 15,
        display: "flex",
        flexWrap: "wrap",
        alignContent: "center",
        justifyContent: "space-between",
        width: "fit-content",
        borderWidth: 1,
        borderColor: neutral33,
        flexDirection: "row",
        height: 32,
        borderRadius: 18,
        overflow: "hidden",
      }}
    >
      {getKeys(def).map((key) => {
        return (
          <TouchableOpacity
            key={key}
            onPress={() => {
              onChange(def[key].filter as any); // FIXME: typing
              setSelected(key);
            }}
            style={{
              height: "100%",
              borderRightColor: neutral33,
              borderRightWidth: 1,
            }}
          >
            <View
              style={{
                backgroundColor: selected === key ? "#16BBFF" : "black",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <BrandText
                style={{
                  color: selected === key ? "black" : "white",
                  fontSize: width < smallMobileWidth ? 12 : 14,
                  paddingHorizontal: 12,
                  textAlign: "center",
                  top: 6,
                }}
              >
                {def[key].name}
              </BrandText>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const getKeys = Object.keys as <T extends object>(obj: T) => (keyof T)[];
