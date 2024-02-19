import React, { ReactNode } from "react";
import { ColorValue, View } from "react-native";
import { SvgProps } from "react-native-svg";

import MiniTableRow from "./MiniTableRow";
import copySVG from "../../../../../assets/icons/copy-gray.svg";
import externalLinkSVG from "../../../../../assets/icons/external-grey.svg";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { SpacerRow } from "@/components/spacer";
import {
  neutral22,
  neutralA3,
  secondaryColor,
  withAlpha,
} from "@/utils/style/colors";
import { fontMedium16, fontSemibold16 } from "@/utils/style/fonts";

type MiniTableItem = {
  label: string | ReactNode;
  value: string | ReactNode;
  valueColor?: ColorValue;
  onPress?: () => void;
  icon?: React.FC<SvgProps> | string;
};

type MiniTableProps = {
  items: MiniTableItem[];
  colorOptions?: {
    labelColor?: ColorValue;
    valueColor?: ColorValue;
    tableColor?: ColorValue;
    borderColor?: ColorValue;
  };
};

export default function MiniTable({
  items,
  colorOptions = {
    labelColor: undefined,
    valueColor: "#fff",
    tableColor: undefined,
    borderColor: undefined,
  },
}: MiniTableProps) {
  const { labelColor, valueColor, tableColor, borderColor } = colorOptions;

  return (
    <View>
      {items.map((tableItem, index) => {
        const {
          label,
          value,
          onPress,
          icon,
          valueColor: tableValueColor,
        } = tableItem;

        const firstItem = index === 0;
        const lastItem = items.length - 1 === index;

        const rightLabel =
          typeof value === "string" ? (
            icon ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <BrandText
                  style={[
                    fontSemibold16,
                    {
                      color: valueColor
                        ? valueColor
                        : tableValueColor
                          ? tableValueColor
                          : "#fff",
                    },
                  ]}
                >
                  {value}
                </BrandText>
                <SpacerRow size={1} />
                <CustomPressable onPress={onPress}>
                  <SVG
                    source={
                      icon === "copy"
                        ? copySVG
                        : icon === "link"
                          ? externalLinkSVG
                          : icon
                    }
                    width={22}
                    height={22}
                  />
                </CustomPressable>
              </View>
            ) : (
              <BrandText
                style={[
                  fontSemibold16,
                  {
                    color: valueColor
                      ? valueColor
                      : tableValueColor
                        ? tableValueColor
                        : "#fff",
                  },
                ]}
              >
                {value}
              </BrandText>
            )
          ) : (
            value
          );

        const leftLabel =
          typeof label === "string" ? (
            <BrandText
              style={[fontMedium16, { color: labelColor ?? neutralA3 }]}
            >
              {label}
            </BrandText>
          ) : (
            label
          );

        return (
          <MiniTableRow
            key={index + Date.now().toPrecision()}
            leftLabel={leftLabel}
            style={{
              borderRadius: 0,
              borderWidth: 1,
              borderTopWidth: 1,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderBottomWidth: lastItem ? 1 : 0,
              borderTopRightRadius: firstItem ? 14 : 0,
              borderTopLeftRadius: firstItem ? 14 : 0,
              borderBottomLeftRadius: lastItem ? 14 : 0,
              borderBottomRightRadius: lastItem ? 14 : 0,
              borderColor: borderColor ?? withAlpha(secondaryColor, 0.12),
              backgroundColor: tableColor ?? neutral22,
            }}
            rightLabel={rightLabel}
          />
        );
      })}
    </View>
  );
}
