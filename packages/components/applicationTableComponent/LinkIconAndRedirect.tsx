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
  children: any;
}> = ({ children, style, textStyle }) => {
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
          Linking.openURL(children);
        }}
      >
        <SVG source={externalLinkSVG} color="white" />
      </TouchableOpacity>
    </View>
  );
};
