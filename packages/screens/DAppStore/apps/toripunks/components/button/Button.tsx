import {
  ImageBackground,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  Text,
} from "react-native";

import buttonBackgroundBlack from "../../assets/RectangleButtonBlack.png";
import { useContentContext } from "../../context/ContentProvider";

export interface ButtonType {
  onPress: () => void;
  style?: StyleProp<TouchableOpacityProps>;
  text: string;
  withImg: boolean;
}

export const Button: React.FC<ButtonType> = ({
  onPress,
  style,
  text,
  withImg,
}) => {
  const contentContext = useContentContext();
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <View style={{}}>
        {withImg ? (
          <ImageBackground
            source={buttonBackgroundBlack}
            style={{ width: 520 }}
          >
            <Text
              style={[
                (contentContext.styles as any)["H1_Bebas_80"],
                {
                  marginTop: 10,
                  marginBottom: 45,
                  color: "#2AF191",
                  textAlign: "center",
                  borderLeftColor: "#2AF191",
                },
              ]}
            >
              {text}
            </Text>
          </ImageBackground>
        ) : (
          <Text>{text}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
