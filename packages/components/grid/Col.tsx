import { StyleSheet, View, ViewProps } from "react-native";

const Col: React.FC<ViewProps> = (props) => {
  return <View style={[styles.container, props.style]}>{props.children}</View>;
};

const styles = StyleSheet.create({
  container: {},
});

export default Col;
