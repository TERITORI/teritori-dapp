import React, { useEffect, useState } from "react";
import { TextInput, View, ViewStyle, TouchableOpacity } from "react-native";

import cameraSVG from "../../../assets/icons/camera.svg";
import penSVG from "../../../assets/icons/pen.svg";
import priceSVG from "../../../assets/icons/price.svg";
import {
  neutral17,
  neutral22,
  neutral33,
  neutral77,
  secondaryColor,
} from "../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold16,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { PrimaryButton } from "../buttons/PrimaryButton";

const WORD_MAX_LIMIT = 1000;

interface CommentInputProps {
  placeholder: string;
  footerText: string[];
  buttonText?: string;
  style?: ViewStyle;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  placeholder,
  style,
  buttonText = "Publish",
}) => {
  const [inputText, setInputText] = useState("");
  const [isPostFooter, setPostFooter] = useState(false);
  const [isInputFocus, setInputFocus] = useState(false);

  useEffect(() => {
    if (inputText.length || isInputFocus) {
      setPostFooter(true);
    } else {
      setPostFooter(false);
    }
  }, [inputText, isInputFocus]);

  return (
    <View style={style}>
      <TertiaryBox
        fullWidth
        height={64}
        style={{
          zIndex: 9,
        }}
        mainContainerStyle={{
          paddingVertical: layout.padding_x1_5,
          paddingHorizontal: layout.padding_x2_5,
          backgroundColor: neutral22,
          flexDirection: "row",
        }}
      >
        <SVG height={24} width={24} source={penSVG} color={secondaryColor} />

        <TextInput
          placeholder={placeholder}
          placeholderTextColor={neutral77}
          onChangeText={setInputText}
          multiline
          style={[
            fontSemibold16,
            {
              width: "100%",
              color: secondaryColor,
              marginLeft: layout.padding_x1_5,

              //@ts-ignore
              outlineStyle: "none",
              outlineWidth: 0,
            },
          ]}
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
        />
        <BrandText
          style={[
            fontSemibold12,
            {
              color: neutral77,
              position: "absolute",
              bottom: 12,
              right: 20,
            },
          ]}
        >
          {inputText.length}/{WORD_MAX_LIMIT}
        </BrandText>
      </TertiaryBox>
      {isPostFooter && (
        <View
          style={{
            backgroundColor: neutral17,
            paddingTop: layout.padding_x3,
            paddingBottom: layout.padding_x1_5,
            marginTop: -layout.padding_x2_5,
            paddingHorizontal: layout.padding_x2_5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <SVG source={priceSVG} height={24} width={24} color={neutral77} />
            <BrandText
              style={[
                fontSemibold13,
                { color: neutral77, marginLeft: layout.padding_x1 },
              ]}
            >
              The cost for this comment is 0.1 Tori
            </BrandText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                height: 32,
                width: 32,
                borderRadius: 24,
                backgroundColor: neutral33,
                alignItems: "center",
                justifyContent: "center",
                marginRight: layout.padding_x2_5,
              }}
            >
              <SVG source={cameraSVG} width={16} height={16} />
            </TouchableOpacity>
            <PrimaryButton
              size="M"
              text={buttonText}
              squaresBackgroundColor={neutral22}
              disabled={!inputText}
            />
          </View>
        </View>
      )}
    </View>
  );
};
