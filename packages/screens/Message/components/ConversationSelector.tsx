import React, { useRef } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import chevronDownSVG from "../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../../assets/icons/chevron-up.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SpacerRow } from "../../../components/spacer";
import { useDropdowns } from "../../../context/DropdownsProvider";
import { useMessage } from "../../../context/MessageProvider";
import { neutral17, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold12 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { CONVERSATION_TYPES } from "../../../utils/types/message";

export const ConversationSelector: React.FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  const { onPressDropdownButton, isDropdownOpen, closeOpenedDropdown } =
    useDropdowns();
  const dropdownRef = useRef<View>(null);
  const { activeConversationType, setActiveConversationType } = useMessage();

  const onPressItem = (conversationType: CONVERSATION_TYPES) => {
    setActiveConversationType(conversationType);
    closeOpenedDropdown();
  };

  const fontSize = 14;

  return (
    <View style={[{}, style]} ref={dropdownRef}>
      <TouchableOpacity
        onPress={() => onPressDropdownButton(dropdownRef)}
        style={{
          flexDirection: "row",
          paddingHorizontal: 12,
        }}
      >
        <SpacerRow size={1} />
        <BrandText
          style={{
            color: "white",
            fontSize,
            letterSpacing: -(fontSize * 0.04),
            fontWeight: "500",
          }}
        >
          {activeConversationType}
        </BrandText>
        <SpacerRow size={1} />
        <SVG
          source={isDropdownOpen(dropdownRef) ? chevronUpSVG : chevronDownSVG}
          width={16}
          height={16}
          color={secondaryColor}
        />
      </TouchableOpacity>

      {isDropdownOpen(dropdownRef) && (
        <TertiaryBox
          width={172}
          style={{ position: "absolute", top: 30 }}
          mainContainerStyle={{
            paddingHorizontal: layout.spacing_x2,
            paddingTop: layout.spacing_x2,
            backgroundColor: neutral17,
            alignItems: "flex-start",
          }}
          noRightBrokenBorder
        >
          {Object.values(CONVERSATION_TYPES).map((type, index) => {
            return (
              <TouchableOpacity
                style={{
                  marginBottom: layout.spacing_x2,
                }}
                key={type}
                onPress={() => onPressItem(type)}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <BrandText
                    style={[
                      fontSemibold12,
                      { marginLeft: layout.spacing_x1_5 },
                    ]}
                  >
                    {type}
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
