import React, { useState } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import chevronUpSVG from "../../assets/icons/chevron-down.svg";
import chevronDownSVG from "../../assets/icons/chevron-up.svg";
import teritoriSVG from "../../assets/icons/networks/teritori.svg";
import { Network } from "../utils/network";
import { neutral17 } from "../utils/style/colors";
import { fontSemibold12 } from "../utils/style/fonts";
import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { TertiaryBox } from "./boxes/TertiaryBox";
import { NetworkIcon } from "./images/NetworkIcon";

export const NetworkSelector: React.FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={style}>
      <TouchableOpacity onPress={() => setIsExpanded((value) => !value)}>
        <TertiaryBox
          width={60}
          mainContainerStyle={{
            flexDirection: "row",
            paddingHorizontal: 12,
            backgroundColor: neutral17,
          }}
          height={40}
        >
          <SVG
            style={{ marginRight: 4 }}
            source={teritoriSVG}
            width={16}
            height={16}
          />
          <SVG
            source={isExpanded ? chevronUpSVG : chevronDownSVG}
            width={16}
            height={16}
          />
        </TertiaryBox>
      </TouchableOpacity>

      {isExpanded && (
        <TertiaryBox
          width={172}
          style={{ position: "absolute", top: 44 }}
          mainContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            backgroundColor: neutral17,
            alignItems: "flex-start",
          }}
        >
          {Object.values(Network).map((network, index) => {
            return (
              <TouchableOpacity style={{ marginBottom: 16 }} key={index}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <NetworkIcon network={network} size={16} />
                  <BrandText style={[fontSemibold12, { marginLeft: 12 }]}>
                    {network}
                  </BrandText>
                </View>
              </TouchableOpacity>
            );
          })}
        </TertiaryBox>
      )}
    </View>
  );
};
