import { ReactNode } from "react";
import { useWindowDimensions, View } from "react-native";

import { layout } from "@/utils/style/layout";

export const WalletContainer: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        padding: layout.spacing_x2,
        backgroundColor: "black",
        flex: 10,
        width,
      }}
    >
      {children}
    </View>
  );
};
