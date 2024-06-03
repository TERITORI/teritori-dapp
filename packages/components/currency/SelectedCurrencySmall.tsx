import React, { forwardRef } from "react";
import { TouchableOpacity, View } from "react-native";

import chevronDownSVG from "@/assets/icons/chevron-down.svg";
import chevronUpSVG from "@/assets/icons/chevron-up.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { CurrencyIcon } from "@/components/currency/CurrencyIcon";
import { NativeCurrencyInfo } from "@/networks";
import { secondaryColor } from "@/utils/style/colors";
import { fontSemibold16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const SelectedCurrencySmall = forwardRef<
  View,
  {
    currency?: NativeCurrencyInfo;
    selectedNetworkId: string;
    isDropdownOpen: boolean;
    setDropdownState: (val: boolean) => void;
    disabled?: boolean;
  }
>(
  (
    { currency, selectedNetworkId, isDropdownOpen, setDropdownState, disabled },
    ref,
  ) => {
    return (
      <View ref={ref} collapsable={false}>
        <TouchableOpacity
          onPress={() => setDropdownState(!isDropdownOpen)}
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
          disabled={disabled}
        >
          <CurrencyIcon
            icon={currency?.icon}
            size={32}
            denom={currency?.denom || ""}
            networkId={selectedNetworkId}
          />
          <View style={{ marginLeft: layout.spacing_x1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <BrandText
                style={[
                  fontSemibold16,
                  !disabled && { marginRight: layout.spacing_x1 },
                ]}
              >
                {currency?.displayName || "ERROR"}
              </BrandText>
              {!disabled && (
                <SVG
                  source={isDropdownOpen ? chevronUpSVG : chevronDownSVG}
                  width={16}
                  height={16}
                  color={secondaryColor}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  },
);
