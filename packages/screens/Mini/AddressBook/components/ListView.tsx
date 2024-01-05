import { ReactNode } from "react";
import { View } from "react-native";

import { BrandText } from "../../../../components/BrandText";

type ListViewProps = {
  left?: ReactNode;
  right?: ReactNode;
  name?: string;
};

export default function ListView({ left, right, name }: ListViewProps) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View>
        {left && left}
        {name && <BrandText>{name}</BrandText>}
      </View>
      {right && right}
    </View>
  );
}
