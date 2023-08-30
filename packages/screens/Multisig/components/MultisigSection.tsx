import React, { useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { ActivityIndicator } from "react-native-paper";

import chevronDownSVG from "../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../../assets/icons/chevron-up.svg";
import walletSVG from "../../../../assets/icons/wallet-grey.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { SpacerRow } from "../../../components/spacer";
import {
  neutral33,
  neutral77,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface MultisigSectionProps {
  title: string;
  containerStyle?: ViewStyle;
  tresholdMax?: number;
  tresholdCurrentCount?: number;
  toriText?: boolean;
  isLoading?: boolean;
  isCollapsable?: boolean;
}

export const MultisigSection: React.FC<MultisigSectionProps> = ({
  title,
  containerStyle,
  children,
  tresholdCurrentCount,
  tresholdMax,
  toriText,
  isLoading,
  isCollapsable,
}) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <CustomPressable
        style={styles.header}
        disabled={!isCollapsable}
        onPress={() => setOpen((isOpen) => !isOpen)}
      >
        <View style={styles.rowCenter}>
          <SVG source={walletSVG} height={28} width={28} />
          <SpacerRow size={2} />
          <BrandText style={[fontSemibold16, { color: neutralA3 }]}>
            {title}
          </BrandText>
        </View>

        <View style={styles.rowCenter}>
          {!isLoading && tresholdMax && (
            <>
              <View style={styles.badge}>
                <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                  Threshold: {tresholdCurrentCount}/{tresholdMax}
                </BrandText>
              </View>
              <SpacerRow size={1.5} />
            </>
          )}

          {!isLoading && toriText && (
            <>
              <View style={styles.badge}>
                <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                  TORI
                </BrandText>
              </View>
              <SpacerRow size={1.5} />
            </>
          )}

          {isLoading && (
            <>
              <ActivityIndicator color={secondaryColor} />
              <SpacerRow size={1.5} />
            </>
          )}
          {isCollapsable && (
            <SVG
              source={isOpen ? chevronUpSVG : chevronDownSVG}
              width={16}
              height={16}
              color={secondaryColor}
            />
          )}
        </View>
      </CustomPressable>

      {(isOpen || !isCollapsable) && (
        <View style={styles.childrenContainer}>{children}</View>
      )}
    </View>
  );
};
// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    borderColor: neutral33,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: layout.padding_x3,
  },
  header: {
    margin: layout.padding_x2,
    marginTop: layout.padding_x1_5,
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 40,
    flexWrap: "wrap",
  },
  childrenContainer: {
    padding: layout.padding_x2_5,
    paddingTop: 0,
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    padding: layout.padding_x1,
    borderWidth: 1,
    borderColor: neutral33,
    borderRadius: 10,
  },
  activityIndicator: { marginBottom: 10 },
});
