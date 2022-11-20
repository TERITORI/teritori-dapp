import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { yellowDefault, neutral33, } from "../../../utils/style/colors";
import { fontMedium48, fontMedium14, } from "../../../utils/style/fonts";
import { neutralA3 } from "../../../utils/style/colors";


type RipperStatProps = {
  name: string,
  value: number,
  containerStyle?: ViewStyle
}

const RipperStat: React.FC<RipperStatProps> = ({ name, value, containerStyle }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <BrandText style={styles.leftCol}>
        {value}
      </BrandText>

      <View style={styles.rightCol}>
        <View style={styles.progressBarOuter} >
          <View style={[styles.processBarInner, { width: `${value}%` }]} />
        </View>

        <BrandText style={styles.subText}>
          {name}
        </BrandText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftCol: {
    minWidth: 80,
    ...fontMedium48 as object
  },
  rightCol: {
    marginLeft: 40
  },
  progressBarOuter: {
    borderRadius: 100,
    height: 8,
    backgroundColor: neutral33,
    width: 164,

  },
  processBarInner: {
    borderRadius: 100,
    height: 8,
    backgroundColor: yellowDefault,
    position: "absolute",
    top: 0,
    left: 0,
  },
  subText: {
    color: neutralA3,
    marginTop: 6,
    ...fontMedium14 as object
  }
});

export default RipperStat;
