import React, { Dispatch, SetStateAction } from "react";
import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import chevronUpSVG from "../../../../assets/icons/chevron-up.svg";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { CurrencyInfo } from "../../../networks";
import { layout } from "../../../utils/style/layout";
import { FadeInView } from "./FadeInView";
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
        <FadeInView style={{ position: "absolute", left: 20, top: 50 }}>
          <TertiaryBox
            mainContainerStyle={{
              padding: layout.padding_x2_5,
              alignItems: "flex-start",
            }}
            width={width - 40}
            noBrokenCorners
          >
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "flex-end",
                marginBottom: layout.padding_x1_5,
              }}
            >
              <TouchableOpacity
                containerStyle={[{ alignSelf: "center" }]}
                style={{ justifyContent: "center" }}
                onPress={close}
              >
                <SVG width={16} height={16} source={chevronUpSVG} />
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
        </FadeInView>
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
    borderRadius: 20,
  },
});
