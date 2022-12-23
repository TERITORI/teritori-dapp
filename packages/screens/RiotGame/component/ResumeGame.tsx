import React from "react";
import {StyleSheet, View} from "react-native";
import {neutral00, neutral22, neutral77, secondaryColor, yellowDefault} from "../../../utils/style/colors";
import {PrimaryButton} from "../../../components/buttons/PrimaryButton";

export const ResumeGame: React.FC<{ onPressResume: () => void; }> = ({onPressResume}) => {
  return (
    <>
      <View style={styles.background}/>
      <View style={styles.buttonWrapper}>
        <PrimaryButton
          size="XL"
          text="Resume the Game"
          color={yellowDefault}
          onPress={onPressResume}
          noBrokenCorners
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    width: "100vw",
    height: "100vh",
    backgroundColor: neutral00,
    opacity: .6,
    zIndex: 50
  },
  buttonWrapper: {
    position: "absolute",
    width: "100vw",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 51
  },
});
