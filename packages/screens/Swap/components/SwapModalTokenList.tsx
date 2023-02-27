import React, { Dispatch, SetStateAction } from "react";
import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import closeSVG from "../../../../assets/icons/close.svg";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { CurrencyInfo } from "../../../networks";
import { neutral00 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { modalMarginPadding } from "../../../utils/style/modals";
import { SelectableCurrency } from "./SelectableCurrency";
export const SwapModalTokenList: React.FC<{
  isOpened: boolean;
  close: () => void;
  width: number;
  currencies?: CurrencyInfo[];
  selectedNetworkId: string;
  setCurrency: Dispatch<SetStateAction<CurrencyInfo | undefined>>;
}> = ({
  isOpened,
  close,
  width,
  currencies,
  selectedNetworkId,
  setCurrency,
}) => {
  if (isOpened)
    return (
      <View style={styles.modalContainer}>
        <TertiaryBox
          mainContainerStyle={{
            padding: layout.padding_x2_5,
            alignItems: "flex-start",
          }}
          width={width - 40}
          style={{
            position: "absolute",
            left: 20,
            top: 55,
            backgroundColor: neutral00,
          }}
          noBrokenCorners
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              containerStyle={[
                { marginLeft: modalMarginPadding },
                { alignSelf: "center" },
              ]}
              style={{ justifyContent: "center" }}
              onPress={close}
            >
              <SVG width={20} height={20} source={closeSVG} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: "100%",
            }}
          >
            {currencies?.map((currencyInfo, index) => (
              <SelectableCurrency
                key={index}
                currency={currencyInfo}
                networkId={selectedNetworkId}
                onPressItem={() => {
                  setCurrency(currencyInfo);
                  close();
                }}
              />
            ))}
          </View>
        </TertiaryBox>
      </View>
    );
  return <></>;
};

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, .8)",
  },
});