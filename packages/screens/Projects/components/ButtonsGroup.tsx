import React from "react";
import { View } from "react-native";

import { SimpleButton } from "@/components/buttons/SimpleButton";
import {
  neutral00,
  neutral33, primaryColor,
  secondaryColor,
  yellowDefault,
} from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";

export type ButtonsGroupType = {
  texts: string[];
  selectedId: number;
  onChange?: (selectedId: number) => void;
  size?: "XS" | "SM" | "M" | "XL";
};

export const ButtonsGroup: React.FC<ButtonsGroupType> = ({
  texts,
  selectedId,
  onChange,
  size = "M",
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginRight: layout.spacing_x3,
      }}
    >
      {texts.map((text, btnId) => {
        return (
          <SimpleButton
            key={btnId}
            text={text}
            size={size}
            color={selectedId === btnId ? neutral00 : secondaryColor}
            bgColor={selectedId === btnId ? primaryColor : neutral33}
            style={[
              btnId === 0 && {
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              },
              btnId === 1 && {
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              },
            ]}
            onPress={() => onChange?.(btnId)}
          />
        );
      })}

      {/*<SimpleButton*/}
      {/*  text="Squad 1"*/}
      {/*  size="XS"*/}
      {/*  color={activeSquadId === 1 ? neutral00 : secondaryColor}*/}
      {/*  bgColor={activeSquadId === 1 ? yellowDefault : neutral33}*/}
      {/*  style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}*/}
      {/*  onPress={() => setActiveSquadId(1)}*/}
      {/*/>*/}
      {/*<SimpleButton*/}
      {/*  text="Squad 2"*/}
      {/*  size="XS"*/}
      {/*  color={activeSquadId === 2 ? neutral00 : secondaryColor}*/}
      {/*  bgColor={activeSquadId === 2 ? yellowDefault : neutral33}*/}
      {/*  style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}*/}
      {/*  onPress={() => setActiveSquadId(2)}*/}
      {/*/>*/}
    </View>
  );
};
