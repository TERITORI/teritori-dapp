import { View } from "react-native";

import { layout } from "../../../utils/style/layout";

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
        paddingVertical: layout.padding_x2_5,
      }}
    >
      {!readOnly && children}
    </View>
  );
};
