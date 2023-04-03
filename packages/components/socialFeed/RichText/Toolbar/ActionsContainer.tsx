import { View, useWindowDimensions } from "react-native";

import { TOOLBAR_HEIGHT } from "./ToolbarContainer";

export const ActionsContainer: React.FC = ({ children }) => {

  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        flexDirection: width < 512 ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
        minHeight: width < 512 ? width < 380 ? 168 : 144 : TOOLBAR_HEIGHT,
      }}
    >
      {children}
    </View>
  );
};
