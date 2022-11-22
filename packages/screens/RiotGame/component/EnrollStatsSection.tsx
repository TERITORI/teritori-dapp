import { StyleSheet, View, ViewStyle } from "react-native";

import { EnrollStat } from "./EnrollStat";

type EnrollStatsSectionProps = {
  containerStyle?: ViewStyle;
};

export const EnrollStatsSection: React.FC<EnrollStatsSectionProps> = ({
  containerStyle,
}) => {
  return (
    <View style={[containerStyle, styles.container]}>
      <EnrollStat title="Number of Fighters" content="833 Rippers" />
      <EnrollStat title="Prize Pool" content="1337 TORI" />
      <EnrollStat title="Rank" content="42/1337" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 10,
  },
});
