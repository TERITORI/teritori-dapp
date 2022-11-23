import { StyleSheet, View, ViewStyle } from "react-native";

import { InfoBox } from "./InfoBox";

type EnrollStatsSectionProps = {
  containerStyle?: ViewStyle;
};

export const EnrollStatsSection: React.FC<EnrollStatsSectionProps> = ({
  containerStyle,
}) => {
  return (
    <View style={[containerStyle, styles.container]}>
      <InfoBox
        size="SM"
        title="Number of Fighters"
        content="833 Rippers"
        width={120}
      />
      <InfoBox size="SM" title="Prize Pool" content="1337 TORI" width={120} />
      <InfoBox size="SM" title="Rank" content="42/1337" width={120} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 10,
  },
});
