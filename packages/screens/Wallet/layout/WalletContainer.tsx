import { ReactNode } from "react";
import { View } from "react-native";

import { layout } from "../../../utils/style/layout";

export const WalletContainer: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <View
      style={{
        padding: layout.spacing_x3,
        backgroundColor: "black",
        flex: 5,
      }}
    >
      {children}
    </View>
  );
};
