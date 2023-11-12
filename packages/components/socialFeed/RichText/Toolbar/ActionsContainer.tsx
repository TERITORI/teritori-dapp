import { ReactNode } from "react";
import { View, useWindowDimensions } from "react-native";

import { SOCIAL_FEED_BREAKPOINT_M } from "../../../../utils/style/layout";

export const ActionsContainer: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { width: windowWidth } = useWindowDimensions();

  return (
    <View
      style={{
        flexDirection:
          windowWidth < SOCIAL_FEED_BREAKPOINT_M ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {children}
    </View>
  );
};
