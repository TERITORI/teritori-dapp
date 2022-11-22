import React from "react";
import {
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  View,
} from "react-native";

import { useAppNavigation } from "../../utils/navigation";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";

export const CollectionInfoInline: React.FC<{
  imageSource: ImageSourcePropType;
  id?: string;
  name?: string;
}> = ({ imageSource, id, name }) => {
  const navigation = useAppNavigation();

  const onPress = () => {
    if (id) navigation.navigate("Collection", { id });
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={imageSource}
          style={{ height: 32, width: 32, borderRadius: 999 }}
        />
        <BrandText
          style={[fontSemibold14, { marginLeft: layout.padding_x1_5 }]}
        >
          {name}
        </BrandText>
      </View>
    </TouchableOpacity>
  );
};
