import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { TouchableOpacity, View } from "react-native";

import chevronDownSVG from "../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../../assets/icons/chevron-up.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CurrencyIcon } from "../../../components/images/CurrencyIcon";
import { DropdownRef, useDropdowns } from "../../../context/DropdownsProvider";
import { CurrencyInfo } from "../../../networks";
import { neutralA3, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const SelectedCurrency: React.FC<{
  currency?: CurrencyInfo;
  selectedNetworkId: string;
  setRef: Dispatch<SetStateAction<DropdownRef>>;
}> = ({ currency, selectedNetworkId, setRef }) => {
  const { onPressDropdownButton, isDropdownOpen } = useDropdowns();

  // Passing ref to parent
  const ref = useRef<View>(null);
  useEffect(() => {
    if (ref.current) {
      setRef(ref);
    }
  }, []);

  return (
    <View ref={ref}>
      <TouchableOpacity
        onPress={() => onPressDropdownButton(ref)}
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <CurrencyIcon
          size={48}
          icon={currency?.icon}
          denom={currency?.denom || ""}
          networkId={selectedNetworkId}
        />
        <View style={{ marginLeft: layout.padding_x1_5 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <BrandText style={{ marginRight: layout.padding_x1 }}>
              {currency?.displayName}
            </BrandText>
            <SVG
              source={isDropdownOpen(ref) ? chevronUpSVG : chevronDownSVG}
              width={16}
              height={16}
              color={secondaryColor}
            />
          </View>
          <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
            {currency?.sourceNetworkDisplayName}
          </BrandText>
        </View>
      </TouchableOpacity>
    </View>
  );
};
