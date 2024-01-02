import React, { forwardRef, useMemo } from "react";
import { TouchableOpacity, View } from "react-native";

import chevronDownSVG from "../../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../../../assets/icons/chevron-up.svg";
import { BrandText } from "../../../../components/BrandText";
import { CurrencyIcon } from "../../../../components/CurrencyIcon";
import { SVG } from "../../../../components/SVG";
import {
  allNetworks,
  CosmosNetworkInfo,
  NativeCurrencyInfo,
  NetworkKind,
} from "../../../../networks";
import { neutralA3, secondaryColor } from "../../../../utils/style/colors";
import { fontSemibold13 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

export const SelectedCurrency = forwardRef<
  View,
  {
    currency?: NativeCurrencyInfo;
    selectedNetworkId: string;
    isDropdownOpen: boolean;
    setDropdownState: (val: boolean) => void;
  }
>(({ currency, selectedNetworkId, isDropdownOpen, setDropdownState }, ref) => {
  const currencyNetwork: CosmosNetworkInfo | undefined = useMemo(() => {
    const cosmosNetworks = allNetworks.filter(
      (networkInfo) => networkInfo.kind === NetworkKind.Cosmos,
    ) as CosmosNetworkInfo[];
    return cosmosNetworks.find(
      (networkInfo) => networkInfo.stakeCurrency === currency?.denom,
    );
  }, [currency?.denom]);

  return (
    <View ref={ref} collapsable={false}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setDropdownState(!isDropdownOpen)}
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <CurrencyIcon
          icon={currency?.icon}
          size={48}
          denom={currency?.denom || ""}
          networkId={selectedNetworkId}
        />
        <View style={{ marginLeft: layout.spacing_x1_5 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <BrandText style={{ marginRight: layout.spacing_x1 }}>
              {currency?.displayName}
            </BrandText>
            <SVG
              source={isDropdownOpen ? chevronUpSVG : chevronDownSVG}
              width={16}
              height={16}
              color={secondaryColor}
            />
          </View>
          <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
            {currencyNetwork?.displayName}
          </BrandText>
        </View>
      </TouchableOpacity>
    </View>
  );
});
