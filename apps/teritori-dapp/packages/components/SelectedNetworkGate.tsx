import { ReactNode } from "react";
import { View } from "react-native";

import { BrandText } from "./BrandText";
import { useSelectedNetworkInfo } from "../hooks/useSelectedNetwork";
import { NetworkInfo } from "../networks";

export const SelectedNetworkGate: React.FC<{
  filter: (n: NetworkInfo) => boolean;
  children: ReactNode;
}> = ({ filter, children }) => {
  const selectedNetwork = useSelectedNetworkInfo();
  if (!selectedNetwork) {
    return null;
  }
  if (filter(selectedNetwork)) {
    return <>{children}</>;
  }
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <BrandText>
        This feature is not supported on {selectedNetwork?.displayName}
      </BrandText>
    </View>
  );
};
