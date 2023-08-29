import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import chevronDownSVG from "../../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../../../assets/icons/chevron-up.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { Separator } from "../../../../components/Separator";
import { TertiaryBox } from "../../../../components/boxes/TertiaryBox";
import { SpacerColumn } from "../../../../components/spacer";
import {
  neutral77,
  neutralA3,
  secondaryColor,
} from "../../../../utils/style/colors";
import { fontSemibold14 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

export const SwapDetail: React.FC<{
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
        <View style={rowStyle}>
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

            {/*TODO: Handle Price impact*/}
            {/*<View style={rowStyle}>*/}
            {/*  <BrandText style={rowLabelStyle}>Price Impact</BrandText>*/}
            {/*  <BrandText style={rowValueStyle}>-???%</BrandText>*/}
            {/*</View>*/}

            <SpacerColumn size={1} />

            <View style={rowStyle}>
              <BrandText style={rowLabelStyle}>
                Swap Fee ({(fee * 100).toFixed(2)}%)
              </BrandText>
              <BrandText style={rowValueStyle}>
                ≈{" "}
                {feeAmountOutUsd < 0.01
                  ? "< $0.01"
                  : `$${feeAmountOutUsd.toFixed(2)}`}
              </BrandText>
            </View>

            <SpacerColumn size={2} />
            <Separator />
            <SpacerColumn size={2} />

            <View style={rowStyle}>
              <BrandText style={rowLabelStyle}>Expected Output</BrandText>
              <BrandText style={rowValueStyle}>
                ≈ {`${expectedAmountOut.toFixed(6)} ${tokenNameOut}`}
              </BrandText>
            </View>

            <SpacerColumn size={1} />

            <View style={rowStyle}>
              <BrandText style={rowLabelStyle}>
                Min received after slippage ({slippage}%)
              </BrandText>
              <BrandText style={rowValueStyle}>
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

const rowStyle: ViewStyle = {
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
};
const rowLabelStyle: TextStyle = {
  ...StyleSheet.flatten(fontSemibold14),
  color: neutral77,
};
const rowValueStyle: ViewStyle = {
  ...StyleSheet.flatten(fontSemibold14),
};
