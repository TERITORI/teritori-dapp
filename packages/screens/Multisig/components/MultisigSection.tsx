import React, { ReactNode, useState } from "react";
import { View, ViewStyle } from "react-native";
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
  children: ReactNode;
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
    <View style={[containerCStyle, containerStyle]}>
      <CustomPressable
        style={headerCStyle}
        disabled={!isCollapsable}
        onPress={() => setOpen((isOpen) => !isOpen)}
      >
        <View style={rowCenterCStyle}>
          <SVG source={walletSVG} height={28} width={28} />
          <SpacerRow size={2} />
          <BrandText style={[fontSemibold16, { color: neutralA3 }]}>
            {title}
          </BrandText>
        </View>

        <View style={rowCenterCStyle}>
          {!isLoading && tresholdMax && (
            <>
              <View style={badgeCStyle}>
                <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                  Threshold: {tresholdCurrentCount}/{tresholdMax}
                </BrandText>
              </View>
              <SpacerRow size={1.5} />
            </>
          )}

          {!isLoading && toriText && (
            <>
              <View style={badgeCStyle}>
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
        <View style={childrenContainerCStyle}>{children}</View>
      )}
    </View>
  );
};

const containerCStyle: ViewStyle = {
  borderColor: neutral33,
  borderWidth: 1,
  borderRadius: 12,
  marginBottom: layout.spacing_x3,
};

const headerCStyle: ViewStyle = {
  margin: layout.spacing_x2,
  marginTop: layout.spacing_x1_5,
  position: "relative",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  minHeight: 40,
  flexWrap: "wrap",
};

const childrenContainerCStyle: ViewStyle = {
  padding: layout.spacing_x2_5,
  paddingTop: 0,
};

const rowCenterCStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};

const badgeCStyle: ViewStyle = {
  padding: layout.spacing_x1,
  borderWidth: 1,
  borderColor: neutral33,
  borderRadius: 10,
};
