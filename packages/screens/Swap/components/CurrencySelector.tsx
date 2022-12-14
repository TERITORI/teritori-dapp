import React, { useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

import chevronDownSVG from "../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../../assets/icons/chevron-up.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { CurrencyIcon } from "../../../components/images/CurrencyIcon";
import { useDropdowns } from "../../../context/DropdownsProvider";
import { CurrencyInfo } from "../../../networks";
import { selectSelectedNetworkId } from "../../../store/slices/settings";
import {
  neutral17,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const CurrencySelector: React.FC<{
  currencies: CurrencyInfo[];
  selectedCurrency?: CurrencyInfo;
  onChangeCurrency: (currency: CurrencyInfo) => void;
}> = ({ currencies, selectedCurrency, onChangeCurrency }) => {
  const { onPressDropdownButton, isDropdownOpen, closeOpenedDropdown } =
    useDropdowns();
  const dropdownRef = useRef<View>(null);
  const selectedNetworkId = useSelector(selectSelectedNetworkId);

  const onPressCurrencyItem = (currencyInfo: CurrencyInfo) => {
    onChangeCurrency(currencyInfo);
    closeOpenedDropdown();
  };

  return (
    <View ref={dropdownRef}>
      <TouchableOpacity
        onPress={() => onPressDropdownButton(dropdownRef)}
        style={styles.container}
      >
        <CurrencyIcon
          size={48}
          icon={selectedCurrency?.icon}
          denom={selectedCurrency?.denom || ""}
          networkId={selectedNetworkId}
        />

        <View style={styles.labelChevronNetwork}>
          <View style={styles.labelChevron}>
            <BrandText style={styles.label}>
              {selectedCurrency?.displayName}
            </BrandText>
            <SVG
              source={
                isDropdownOpen(dropdownRef) ? chevronUpSVG : chevronDownSVG
              }
              width={16}
              height={16}
              color={secondaryColor}
            />
          </View>
          <BrandText style={[fontSemibold13, styles.network]}>
            {selectedCurrency?.sourceNetworkDisplayName}
          </BrandText>
        </View>

        {isDropdownOpen(dropdownRef) && (
          <TertiaryBox
            width={172}
            style={styles.menuBox}
            mainContainerStyle={styles.menuBoxMainContainer}
            noBrokenCorners
          >
            {currencies.map((currencyInfo) => (
              <TouchableOpacity
                onPress={() => onPressCurrencyItem(currencyInfo)}
                key={currencyInfo.denom}
                style={styles.menuItem}
              >
                <CurrencyIcon
                  size={48}
                  denom={currencyInfo.denom}
                  networkId={selectedNetworkId}
                />
                <BrandText style={styles.menuItemLabel}>
                  {currencyInfo?.displayName}
                </BrandText>
              </TouchableOpacity>
            ))}
          </TertiaryBox>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelChevronNetwork: {
    marginLeft: layout.padding_x1_5,
  },
  labelChevron: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    marginRight: layout.padding_x1,
  },
  network: {
    color: neutralA3,
  },
  menuBox: {
    position: "absolute",
    top: 56,
    left: -17,
  },
  menuBoxMainContainer: {
    paddingHorizontal: layout.padding_x2,
    paddingTop: layout.padding_x2,
    backgroundColor: neutral17,
    alignItems: "flex-start",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: layout.padding_x2,
  },
  menuItemLabel: {
    marginLeft: layout.padding_x1_5,
  },
});
