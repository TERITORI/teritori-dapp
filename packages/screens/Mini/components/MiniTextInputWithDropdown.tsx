import { Fragment, useState } from "react";
import { View } from "react-native";

import inputAddressSVG from "../../../../assets/icons/input-address.svg";
import eyeLensSVG from "../../../../assets/icons/search-gray.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { Separator } from "../../../components/separators/Separator";
import {
  neutral22,
  neutral39,
  neutralA3,
  secondaryColor,
  withAlpha,
} from "../../../utils/style/colors";
import { fontMedium16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import MiniTextInput from "../AddressBook/components/MiniTextInput";

type OptionType = {
  label: string;
  subLabel: string;
  value: string;
};

interface MiniTextInputWithDropdownProps {
  onChangeText?: (value: string) => void;
  value?: string;
  options: OptionType[];
}

export default function MiniTextInputWithDropdown({
  onChangeText,
  value,
  options,
}: MiniTextInputWithDropdownProps) {
  const [searchValue, setSearchValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  function onItemSelect(value: string) {
    if (!onChangeText) {
      return;
    }
    onChangeText(value);
  }

  return (
    <View
      style={{
        backgroundColor: neutral22,
        borderColor: showOptions
          ? withAlpha(secondaryColor, 0.12)
          : "transparent",
        borderWidth: 1,
        borderRadius: 10,
        position: "relative",
        zIndex: 100,
        borderBottomEndRadius: showOptions ? 0 : 10,
        borderBottomStartRadius: showOptions ? 0 : 10,
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
      }}
    >
      <MiniTextInput
        placeholder="Recepient's Teritori Address"
        value={value}
        onChangeText={onChangeText}
        right={
          <CustomPressable onPress={() => setShowOptions(true)}>
            <View
              style={{
                backgroundColor: neutral39,
                borderRadius: 18,
                paddingHorizontal: 14,
                paddingVertical: 4,
              }}
            >
              <SVG source={inputAddressSVG} height={24} width={24} />
            </View>
          </CustomPressable>
        }
      />

      {showOptions && (
        <View
          style={{
            position: "absolute",
            top: "100%",
            left: -1,
            right: -1,
            zIndex: 99999,
            backgroundColor: neutral22,
            borderColor: withAlpha(secondaryColor, 0.12),
            borderWidth: 1,
            borderBottomEndRadius: 10,
            borderBottomStartRadius: 10,
          }}
        >
          <View
            style={{
              paddingHorizontal: layout.spacing_x1,
              marginVertical: 10,
              width: "100%",
            }}
          >
            <MiniTextInput
              icon={eyeLensSVG}
              style={{
                backgroundColor: "#000",
                paddingVertical: layout.spacing_x1,
                paddingHorizontal: layout.spacing_x1_5,
              }}
              value={searchValue}
              onChangeText={(value) => setSearchValue(value)}
              placeholder="Search"
              placeholderTextColor={neutralA3}
            />
          </View>
          <View>
            {Array.isArray(options) &&
              options.length > 0 &&
              options.map((opt, idx) => (
                <Fragment key={`${opt.value}-${idx}`}>
                  <CustomPressable
                    onPress={() => {
                      onItemSelect(opt.value);
                      setShowOptions(false);
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingHorizontal: layout.spacing_x2,
                      paddingVertical: layout.spacing_x1_5,
                    }}
                  >
                    {opt.label && typeof opt.label === "string" ? (
                      <BrandText style={[fontMedium16, {}]}>
                        {opt.label}
                      </BrandText>
                    ) : (
                      opt.label
                    )}
                    {opt.subLabel && (
                      <BrandText style={[fontMedium16, { color: neutralA3 }]}>
                        {opt.subLabel}
                      </BrandText>
                    )}
                  </CustomPressable>
                  {idx + 1 < options.length && <Separator />}
                </Fragment>
              ))}
          </View>
        </View>
      )}
    </View>
  );
}
