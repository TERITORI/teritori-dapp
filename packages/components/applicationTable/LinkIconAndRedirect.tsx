import {
  Linking,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import externalLinkSVG from "../../../assets/icons/external-link.svg";
import { secondaryColor } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { SVG } from "../SVG";

export const LinkIconAndRedirect: React.FC<{
  style?: StyleProp<ViewStyle>;
  value: string;
}> = ({ value, style }) => {
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
        <SVG source={externalLinkSVG} color={secondaryColor} />
      </TouchableOpacity>
    </View>
  );
};
