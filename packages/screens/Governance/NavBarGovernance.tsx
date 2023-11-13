import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";

import { ProposalStatus } from "./types";
import { BrandText } from "../../components/BrandText/BrandText";
import { neutral33 } from "../../utils/style/colors";

const def = {
  all: {
    name: "All Periods",
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

export const NavBarGovernance: React.FC<{
  onChange: (filter?: ProposalStatus) => void;
}> = ({ onChange }) => {
  const [selected, setSelected] = useState<keyof typeof def>("all");

  return (
    <View>
      <View
        style={{
          marginTop: 15,
          borderWidth: 1,
          borderColor: neutral33,
          flexDirection: "row",
          borderRadius: 18,
          overflow: "hidden",
          alignSelf: "flex-start",
          height: 32,
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
                    fontSize: 14,
                    paddingHorizontal: 12,
                    textAlign: "center",
                  }}
                >
                  {def[key].name}
                </BrandText>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const getKeys = Object.keys as <T extends object>(obj: T) => (keyof T)[];
