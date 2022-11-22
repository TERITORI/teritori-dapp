import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { neutral00 } from "../../../utils/style/colors";
import EnrollStatsSection from "./EnrollStatsSection";
import { RiotGameHeader } from "./RiotGameHeader";

type GameContentViewProps = {
  containerStyle?: ViewStyle;
};

const GameContentView: React.FC<GameContentViewProps> = (props) => {
  return (
    <View style={styles.container}>
      <RiotGameHeader />

      <ScrollView>
        <EnrollStatsSection />

        <>{props.children}</>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: neutral00,
  },
});

export default GameContentView;
