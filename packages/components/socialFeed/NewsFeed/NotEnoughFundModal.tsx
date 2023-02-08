import React from "react";
import { View } from "react-native";

import priceSVG from "../../../../assets/icons/price.svg";
import {
  errorColor,
  neutral11,
  neutral77,
  redDefault,
} from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import ModalBase from "../../modals/ModalBase";

const DO_SOMETHING_BUTTONS = [
  {
    text: "Mint an NFT on the marketplace",
    onPress: () => {},
  },
  {
    text: "Sell an NFT on the marketplace",
    onPress: () => {},
  },
  {
    text: "Add funds with card",
    onPress: () => {},
  },
];

interface TNotEnoughFundModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NotEnoughFundModal: React.FC<TNotEnoughFundModalProps> = ({
  onClose,
  visible,
}) => {
  return (
    <ModalBase
      visible={visible}
      onClose={onClose}
      width={457}
      label="Do something to get $tori"
    >
      <View
        style={{
          borderRadius: 8,
          backgroundColor: neutral11,
          borderWidth: 1,
          borderColor: errorColor,
          position: "absolute",
          top: -170,
          left: 0,
          right: 0,
          paddingVertical: 12,
          paddingHorizontal: 12,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(255, 70, 70, 0.1)",
            height: 32,
            width: 32,
            borderRadius: 30,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 20,
          }}
        >
          <SVG source={priceSVG} height={24} width={24} color={redDefault} />
        </View>
        <View>
          <BrandText style={[fontSemibold13]}>Not enough $tori</BrandText>
          <BrandText
            style={[fontSemibold13, { color: neutral77, maxWidth: 300 }]}
            numberOfLines={2}
          >
            Oh, you don't have enough $tori to post! Let's do something for
            community!
          </BrandText>
        </View>
      </View>
      <View style={{ flex: 1, alignItems: "center", paddingBottom: 20 }}>
        {DO_SOMETHING_BUTTONS.map((item) => (
          <SecondaryButton
            key={item.text}
            text={item.text}
            onPress={item.onPress}
            size="XL"
            style={{
              marginBottom: 20,
            }}
            fullWidth
          />
        ))}
      </View>
    </ModalBase>
  );
};
