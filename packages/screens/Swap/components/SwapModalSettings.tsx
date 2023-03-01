import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Pressable, TextInput, View } from "react-native";

import infoSVG from "../../../../assets/icons/info.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import {
  neutral77,
  neutralA3,
  primaryColor,
  primaryTextColor,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { isFloatText } from "../../../utils/text";
import { FadeInView } from "./FadeInView";

type SlippageItem = {
  value: number;
  isSelected?: boolean;
};

const SelectableItem: React.FC<{
  item?: SlippageItem;
  onPress: () => void;
  isSelected?: boolean;
}> = ({ onPress, isSelected, children }) => {
  return (
    <Pressable
      style={[
        {
          padding: layout.padding_x1,
          flexDirection: "row",
          borderRadius: 7,
          height: 32,
          width: 64,
          justifyContent: "center",
          alignItems: "center",
        },
        isSelected && { backgroundColor: primaryColor },
      ]}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
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
  const inputRef = useRef<TextInput>(null);

  const onChangeManualSlippage = (value: string) => {
    if (!value) {
      setManualSlippage("");
      return;
    }
    if (isFloatText(value)) setManualSlippage(value);
  };

  const selectManualSlippage = () => {
    const newItems: SlippageItem[] = [];
    slippageItems.forEach((sItem) => {
      sItem.isSelected = false;
      newItems.push(sItem);
    });
    setManualSlippageSelected(true);
    setSlippageItems(newItems);
    setSlippageValue(parseFloat(manualSlippage));
  };

  const onPressSlippageItem = (item: SlippageItem) => {
    inputRef.current?.blur();
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
    inputRef.current?.focus();
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
    // We ignore deps, because of infinite rerender if we put selectManualSlippage and setSlippageValue in deps
  }, [manualSlippage]); // eslint-disable-line react-hooks/exhaustive-deps

  if (settingsOpened)
    return (
      <FadeInView style={{ position: "absolute", right: 20, top: 55 }}>
        <TertiaryBox
          mainContainerStyle={{
            padding: layout.padding_x2_5,
            alignItems: "flex-start",
          }}
          width={306}
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
              <SelectableItem
                key={index}
                item={item}
                onPress={() => onPressSlippageItem(item)}
                isSelected={item.isSelected}
              >
                <BrandText
                  style={[
                    fontSemibold14,
                    item.isSelected && { color: primaryTextColor },
                  ]}
                >
                  {item.value}%
                </BrandText>
              </SelectableItem>
            ))}

            <SelectableItem
              onPress={onFocusManualSlippage}
              isSelected={manualSlippageSelected}
            >
              <TextInputCustom
                ref={inputRef}
                label=""
                name=""
                variant="noStyle"
                textInputStyle={[
                  {
                    textAlign: "center",
                    height: "100%",
                    width: manualSlippage ? manualSlippage.length * 9 : 20,
                    color: manualSlippageSelected
                      ? primaryTextColor
                      : secondaryColor,
                  },
                  fontSemibold14,
                ]}
                onChangeText={(value: string) => onChangeManualSlippage(value)}
                value={manualSlippage}
                maxLength={5}
                placeholder="2.5"
              />
              <BrandText
                style={[
                  fontSemibold14,
                  {
                    color: manualSlippageSelected
                      ? primaryTextColor
                      : manualSlippage
                      ? secondaryColor
                      : neutralA3,
                  },
                ]}
              >
                %
              </BrandText>
            </SelectableItem>
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
      </FadeInView>
    );
  return <></>;
};
