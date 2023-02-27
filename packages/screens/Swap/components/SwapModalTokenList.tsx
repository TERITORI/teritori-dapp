import React, { Dispatch, SetStateAction, useRef, useEffect } from "react";
import { Text, View, StyleSheet, Animated } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import chevronUpSVG from "../../../../assets/icons/chevron-up.svg";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { CurrencyInfo } from "../../../networks";
import { neutral00 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { SelectableCurrency } from "./SelectableCurrency";
import type {PropsWithChildren} from 'react';
import type {ViewStyle} from 'react-native';

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
      <FadeInView style={{position: "absolute", left: 20, top: 50}}>
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
type FadeInViewProps = PropsWithChildren<{style: ViewStyle}>;
const FadeInView: React.FC<FadeInViewProps> = props => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}>
      {props.children}
    </Animated.View>
  );
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
