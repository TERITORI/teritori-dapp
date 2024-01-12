import {
  Linking,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import externalLinkSVG from "../../../assets/icons/external-link.svg";
import { layout } from "../../utils/style/layout";
import { SVG } from "../SVG";

export const LinkIconAndRedirect: React.FC<{
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  value: string;
}> = ({ value, style, textStyle }) => {
  return (
    <View
      style={[
        {
          paddingRight: layout.spacing_x1,
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(value);
        }}
      >
        <SVG source={externalLinkSVG} color="white" />
      </TouchableOpacity>
    </View>
  );
};
