import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import infoSVG from "../../../../assets/icons/info.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import {
  neutral00,
  neutral77,
  primaryColor,
  primaryTextColor,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

type SlippageItem = {
  value: number;
  isSelected?: boolean;
};

export const SwapModalSettings: React.FC<{
  setSlippageValue: Dispatch<SetStateAction<number>>;
  settingsOpened?: boolean;
}> = ({ settingsOpened, setSlippageValue }) => {
  const [infoVisible, setInfoVisible] = useState(false);
  const [manualSlippage, setManualSlippage] = useState("");
  const [slippageItems, setSlippageItems] = useState([
    { value: 1, isSelected: true },
    { value: 3 },
    { value: 5 },
  ]);
  const [manualSlippageSelected, setManualSlippageSelected] = useState(false);

  const onChangeManualSlippage = (value: string) => {
    const withoutPercent = value.split("%")[0];
    if (!withoutPercent) {
      setManualSlippage("");
      return;
    }
    const regOnlyFloats = new RegExp(/[+-]?([0-9]*[.])?[0-9]+/);
    const matches = regOnlyFloats.exec(withoutPercent) || "";
    if (!matches) return;
    setManualSlippage(matches[0] + "%");
  };

  const selectManualSlippage = () => {
    const newItems: SlippageItem[] = [];
    slippageItems.forEach((sItem) => {
      sItem.isSelected = false;
      newItems.push(sItem);
    });
    setManualSlippageSelected(true);
    setSlippageItems(newItems);
    setSlippageValue(parseFloat(manualSlippage.split("%")[0]));
  };

  const onPressSlippageItem = (item: SlippageItem) => {
    const newItems: SlippageItem[] = [];
    slippageItems.forEach((sItem) => {
      sItem.isSelected = false;
      if (sItem === item) {
        item.isSelected = true;
        setSlippageValue(item.value);
      }
      newItems.push(sItem);
    });
    setManualSlippageSelected(false);
    setSlippageItems(newItems);
  };

  const onFocusManualSlippage = () => {
    if (!manualSlippage || manualSlippageSelected) return;
    selectManualSlippage();
  };

  useEffect(() => {
    if (!manualSlippage) {
      setManualSlippageSelected(false);
      setSlippageItems([
        { value: 1, isSelected: true },
        { value: 3 },
        { value: 5 },
      ]);
      setSlippageValue(1);
      return;
    }
    selectManualSlippage();
  }, [manualSlippage]);

  if (settingsOpened)
    return (
      <TertiaryBox
        mainContainerStyle={{
          padding: layout.padding_x2_5,
          alignItems: "flex-start",
        }}
        style={{ position: "absolute", right: 20, top: 55 }}
        width={274}
        noBrokenCorners
      >
        <BrandText style={fontSemibold16}>Transaction Settings</BrandText>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: layout.padding_x1,
            marginBottom: layout.padding_x2,
          }}
        >
          <BrandText
            style={[
              { marginRight: layout.padding_x1, color: neutral77 },
              fontSemibold14,
            ]}
          >
            Slippage tolerance
          </BrandText>
          <CustomPressable
            onHoverIn={() => setInfoVisible(true)}
            onHoverOut={() => setInfoVisible(false)}
          >
            <SVG source={infoSVG} width={16} height={16} />
          </CustomPressable>
        </View>

        <TertiaryBox
          mainContainerStyle={{
            padding: layout.padding_x0_5,
            flexDirection: "row",
          }}
          fullWidth
          noBrokenCorners
        >
          {slippageItems.map((item, index) => (
            <Pressable
              key={index}
              style={[
                {
                  borderRadius: 7,
                  height: 32,
                  width: 56,
                  justifyContent: "center",
                  alignItems: "center",
                },
                item.isSelected && { backgroundColor: primaryColor },
              ]}
              onPress={() => onPressSlippageItem(item)}
            >
              <BrandText
                style={[
                  fontSemibold14,
                  item.isSelected && { color: primaryTextColor },
                ]}
              >
                {item.value}%
              </BrandText>
            </Pressable>
          ))}

          <TextInputCustom
            onFocus={() => onFocusManualSlippage()}
            label=""
            name=""
            variant="noStyle"
            textInputStyle={{
              borderRadius: 7,
              height: 32,
              width: 56,
              textAlign: "center",
              backgroundColor: manualSlippageSelected
                ? primaryColor
                : neutral00,
              color: manualSlippageSelected ? primaryTextColor : secondaryColor,
            }}
            onChangeText={(value) => onChangeManualSlippage(value)}
            value={manualSlippage}
            maxLength={6}
            placeholder="2.5%"
          />
        </TertiaryBox>

        {/*====== Info box */}
        {infoVisible && (
          <TertiaryBox
            mainContainerStyle={{ padding: layout.padding_x2 }}
            style={{ position: "absolute", left: -36, top: -26 }}
            noBrokenCorners
          >
            <BrandText style={fontSemibold14}>
              Your transaction will revert if the price changes {"\n"}
              unfavorably by more than this percentage.
            </BrandText>
          </TertiaryBox>
        )}
      </TertiaryBox>
    );
  return <></>;
};
