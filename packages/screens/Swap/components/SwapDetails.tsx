import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import chevronDownSVG from "../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../../assets/icons/chevron-up.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SpacerColumn } from "../../../components/spacer";
import {
  neutral77,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const SwapDetails: React.FC<{
  slippage: number;
  fee: number;
  feeAmountOutUsd: number;
  expectedAmountOut: number;
  spotPrice: string;
  tokenNameIn: string;
  tokenNameOut: string;
  amountIn?: string;
}> = ({
  slippage,
  fee,
  feeAmountOutUsd,
  expectedAmountOut,
  spotPrice,
  tokenNameIn,
  tokenNameOut,
  amountIn,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!amountIn) setIsOpen(false);
  }, [amountIn]);

  return (
    <Pressable
      onPress={() => setIsOpen((isOpen) => !isOpen && !!amountIn)}
      style={{ width: "100%" }}
    >
      <TertiaryBox
        fullWidth
        mainContainerStyle={{ padding: layout.padding_x2 }}
      >
        <View style={styles.row}>
          <BrandText
            style={[fontSemibold14, !amountIn && { color: neutralA3 }]}
          >
            1 {tokenNameIn + " "}≈{" "}
            {spotPrice === "0" || !spotPrice
              ? "0"
              : parseFloat(spotPrice).toFixed(6)}
            {" " + tokenNameOut}
          </BrandText>

          {!!amountIn && (
            <SVG
              source={isOpen ? chevronUpSVG : chevronDownSVG}
              width={16}
              height={16}
              color={secondaryColor}
            />
          )}
        </View>

        {isOpen && (
          <>
            <SpacerColumn size={2.5} />

            <View style={styles.row}>
              <BrandText style={styles.rowLabel}>Price Impact</BrandText>
              <BrandText style={styles.rowValue}>-???%</BrandText>
            </View>

            <SpacerColumn size={1} />

            <View style={styles.row}>
              <BrandText style={styles.rowLabel}>
                Swap Fee ({(fee * 100).toFixed(2)}%)
              </BrandText>
              <BrandText style={styles.rowValue}>
                ≈{" "}
                {feeAmountOutUsd < 0.01
                  ? "< $0.01"
                  : `$${feeAmountOutUsd.toFixed(2)}`}
              </BrandText>
            </View>

            <SpacerColumn size={2} />
            <Separator />
            <SpacerColumn size={2} />

            <View style={styles.row}>
              <BrandText style={styles.rowLabel}>Expected Output</BrandText>
              <BrandText style={styles.rowValue}>
                ≈ {`${expectedAmountOut.toFixed(6)} ${tokenNameOut}`}
              </BrandText>
            </View>

            <SpacerColumn size={1} />

            <View style={styles.row}>
              <BrandText style={styles.rowLabel}>
                Min received after slippage ({slippage}%)
              </BrandText>
              <BrandText style={styles.rowValue}>
                ≈{" "}
                {`${(
                  expectedAmountOut -
                  (expectedAmountOut * slippage) / 100
                ).toFixed(6)} ${tokenNameOut}`}
              </BrandText>
            </View>
          </>
        )}
      </TertiaryBox>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLabel: {
    ...StyleSheet.flatten(fontSemibold14),
    color: neutral77,
  },
  rowValue: {
    ...StyleSheet.flatten(fontSemibold14),
  },
});
