import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

import { neutral17, neutral33 } from "../../../../utils/style/colors";
import { fontSemibold28 } from "../../../../utils/style/fonts";
import { BrandText } from "../../../BrandText";

export const CreateShortPostButtonFloating: React.FC<{
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ onPress, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          width: 68,
          height: 68,
          backgroundColor: neutral17,
          borderColor: neutral33,
          borderWidth: 1,
          borderRadius: 999,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      <BrandText style={fontSemibold28}>+</BrandText>
    </TouchableOpacity>
  );
};
