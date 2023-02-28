import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { TouchableOpacity, View } from "react-native";

import chevronDownSVG from "../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../../assets/icons/chevron-up.svg";
import { BrandText } from "../../../components/BrandText";
import { CurrencyIcon } from "../../../components/CurrencyIcon";
import { SVG } from "../../../components/SVG";
import { useDropdowns } from "../../../context/DropdownsProvider";
import {
  allNetworks,
  CosmosNetworkInfo,
  NativeCurrencyInfo,
  NetworkKind,
} from "../../../networks";
import { neutralA3, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const SelectedCurrency: React.FC<{
  currency?: NativeCurrencyInfo;
  selectedNetworkId: string;
  setRef: Dispatch<SetStateAction<RefObject<any> | null>>;
}> = ({ currency, selectedNetworkId, setRef }) => {
  const { onPressDropdownButton, isDropdownOpen } = useDropdowns();
  const currencyNetwork: CosmosNetworkInfo | undefined = useMemo(() => {
    const cosmosNetworks = allNetworks.filter(
      (networkInfo) => networkInfo.kind === NetworkKind.Cosmos
    ) as CosmosNetworkInfo[];
    return cosmosNetworks.find(
      (networkInfo) => networkInfo.stakeCurrency === currency?.denom
    );
  }, [currency?.denom]);

  // Passing ref to parent
  const ref = useRef<View>(null);
  useEffect(() => {
    if (ref.current) {
      setRef(ref);
    }
  }, [setRef]);

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
          icon={currency?.icon}
          size={48}
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
            {currencyNetwork?.displayName}
          </BrandText>
        </View>
      </TouchableOpacity>
    </View>
  );
};
