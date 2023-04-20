import { View, useWindowDimensions } from "react-native";

import { TOOLBAR_HEIGHT } from "./ToolbarContainer";
import { RESPONSIVE_BREAKPOINT_S } from "../../../../utils/style/layout";

export const ActionsContainer: React.FC = ({ children }) => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        flexDirection: width < RESPONSIVE_BREAKPOINT_S ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
        minHeight:
          width < RESPONSIVE_BREAKPOINT_S
            ? width < 380
              ? 168
              : 144
            : TOOLBAR_HEIGHT,
      }}
    >
      {children}
    </View>
  );
};
