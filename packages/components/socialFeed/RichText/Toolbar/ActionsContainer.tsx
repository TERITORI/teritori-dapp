import { View } from "react-native";

import { TOOLBAR_HEIGHT } from "./ToolbarContainer";

export const ActionsContainer: React.FC = ({ children }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
        minHeight: TOOLBAR_HEIGHT,
      }}
    >
      {children}
    </View>
  );
};
