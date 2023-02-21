import { View } from "react-native";

export const ActionsContainer: React.FC<{ readOnly?: boolean }> = ({
  readOnly,
  children,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: !readOnly ? "space-between" : "center",
        flex: 1,
      }}
    >
      {!readOnly && children}
    </View>
  );
};
