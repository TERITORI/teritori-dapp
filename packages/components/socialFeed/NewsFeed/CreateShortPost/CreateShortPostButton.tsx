import { TouchableOpacity } from "react-native";

import { neutral17, neutral33 } from "../../../../utils/style/colors";
import { fontSemibold28 } from "../../../../utils/style/fonts";
import { BrandText } from "../../../BrandText";

export const CreateShortPostButton: React.FC<{
  onPress: () => void;
}> = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        position: "absolute",
        right: 68,
        bottom: 68,
        width: 68,
        height: 68,
        backgroundColor: neutral17,
        borderColor: neutral33,
        borderWidth: 1,
        borderRadius: 999,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BrandText style={fontSemibold28}>+</BrandText>
    </TouchableOpacity>
  );
};
