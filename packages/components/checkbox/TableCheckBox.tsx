import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import Tick from "../../../assets/icons/tick.svg";
import {
  neutral00,
  neutral17,
  neutralA3,
  primaryColor,
} from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { SVG } from "../SVG";

type TableCheckBoxProps = {
  zoom?: number;
  value: boolean;
  setValue: any;
};

export const TableCheckBox: React.FC<TableCheckBoxProps> = ({
  zoom = 1,
  value,
  setValue,
}) => {
  const unitHeight = 38;

  const styles = StyleSheet.create({
    unitContainer: {
      width: "100%",
      height: unitHeight,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: neutral00,
    },
    checked: {
      width: zoom * layout.spacing_x2_5,
      height: zoom * layout.spacing_x2_5,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: primaryColor,
      borderRadius: 5,
    },
    unchecked: {
      width: zoom * layout.spacing_x2_5,
      height: zoom * layout.spacing_x2_5,
      borderWidth: 1,
      borderColor: neutralA3,
      borderRadius: 5,
      backgroundColor: neutral17,
    },
  });

  return (
    <Pressable onPress={() => setValue(!value)} style={styles.unitContainer}>
      <View style={value ? styles.checked : styles.unchecked}>
        {value && <SVG source={Tick} height={zoom * 10} width={zoom * 10} />}
      </View>
    </Pressable>
  );
};
