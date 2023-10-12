import React from "react";
import { StyleSheet, View } from "react-native";

import { PrettyPrint } from "../../screens/Marketplace/types";
import { neutral22, neutralA3 } from "../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { CurrencyIcon } from "../CurrencyIcon";
import { SpacerColumn } from "../spacer";

type CollectionStatProps = {
  label: string;
  value?: string;
  currencyIcon?: PrettyPrint;
};

const ICON_SIZE = 19;

export const CollectionStat = ({
  label,
  value,
  currencyIcon,
}: CollectionStatProps) => {
  return (
    <View style={styles.container}>
      <BrandText
        numberOfLines={1}
        ellipsizeMode="tail"
        style={styles.labelText}
      >
        {label}
      </BrandText>
      <SpacerColumn size={0.75} />
      <View style={styles.rowCenter}>
        <BrandText
          style={[
            fontSemibold14,
            {
              lineHeight: 19,
              marginRight: layout.spacing_x0_5,
            },
          ]}
        >
          {value}
        </BrandText>
        {currencyIcon && (
          <CurrencyIcon
            networkId={currencyIcon.networkId}
            denom={currencyIcon.denom}
            size={ICON_SIZE}
          />
        )}
      </View>
    </View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 176,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: neutral22,
  },
  labelText: StyleSheet.flatten([
    fontSemibold12,
    {
      color: neutralA3,
    },
  ]),
  rowCenter: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "nowrap",
    alignItems: "center",
  },
});
