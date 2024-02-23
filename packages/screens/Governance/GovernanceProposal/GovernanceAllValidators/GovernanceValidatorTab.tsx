import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import AbstainSVG from "../../../../../assets/icons/abstain.svg";
import NoWithVetoSVG from "../../../../../assets/icons/nowithveto.svg";
import PassedSVG from "../../../../../assets/icons/passed.svg";
import RejectSVG from "../../../../../assets/icons/reject.svg";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import {
  additionalRed,
  additionalSuccess,
  errorColor,
  neutral17,
  neutral33,
  neutralA3,
  secondaryColor,
  transparentColor,
} from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { objectKeys } from "@/utils/typescript";
const def = {
  all: {
    name: "All validators",
    color: secondaryColor,
    icon: "",
  },
  yes: {
    name: "Yes",
    icon: PassedSVG,
    color: additionalSuccess,
  },
  no: {
    name: "No",
    icon: RejectSVG,
    color: errorColor,
  },
  nowithveto: {
    name: "NoWithVeto",
    icon: NoWithVetoSVG,
    color: additionalRed,
  },
  abstain: {
    name: "Abstain",
    icon: AbstainSVG,
    color: neutralA3,
  },
};

export const GovernanceValidatorTab: React.FC<{
  onChange: (key: string) => void;
}> = ({ onChange }) => {
  const [selected, setSelected] = useState<keyof typeof def>("all");

  return (
    <>
      <View style={{ flexDirection: "row" }}>
        {objectKeys(def).map((key) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onChange(key);
                setSelected(key);
              }}
              style={{
                backgroundColor:
                  key === selected ? neutral17 : transparentColor,
                marginHorizontal: layout.spacing_x0_5,
                borderRadius: 100,
                borderWidth: 1,
                borderColor: neutral33,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: layout.spacing_x1,
              }}
            >
              {def[key].icon !== "" && (
                <SVG source={def[key].icon} width={14} height={14} />
              )}

              <BrandText
                style={[
                  fontSemibold14,
                  { color: def[key].color, margin: layout.spacing_x1 },
                ]}
              >
                {def[key].name}
              </BrandText>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
};
