import {
  ImageBackground,
  TouchableOpacity,
  View,
  Text,
  StyleProp,
  ViewStyle,
  FlexStyle,
} from "react-native";

import buttonBackgroundBlack from "../../assets/button/RectangleButtonBlack.png";
import buttonBackgroundBlackSmall from "../../assets/button/RectangleButtonSmall.png";
import buttonBackgorundBlackMobile from "../../assets/button/RectangleButtonMobile.png";
import { useContentContext } from "../../context/ContentProvider";

export interface ButtonType {
  onPress?: () => void;
  text: string;
  size: "S" | "L" | "L-mobile";
  withImg: boolean;
  style?: StyleProp<ViewStyle>;
}

const buttonSrc = {
  S: buttonBackgroundBlackSmall,
  L: buttonBackgroundBlack,
  "L-mobile": buttonBackgorundBlackMobile,
};

export const Button: React.FC<ButtonType> = ({
  onPress,
  text,
  size,
  withImg,
  style,
}) => {
  const buttonStyles = useStyles(size);
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={style}>
        {withImg ? (
          <ImageBackground
            source={buttonSrc[size]}
            resizeMode="contain"
            style={buttonStyles.backgroundImg as StyleProp<FlexStyle>}
          >
            <Text style={buttonStyles.text}>{text}</Text>
          </ImageBackground>
        ) : (
          <Text>{text}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const useStyles = (size: ButtonType["size"]) => {
  const contentContext = useContentContext();
  // no StyleSheet.create :)
  switch (size) {
    case "L":
      return {
        backgroundImg: {
          width: 520,
          justifyContent: "space-around",
        },
        text: [
          contentContext.styles["H1_Bebas_80"],
          {
            marginTop: 10,
            marginBottom: 45,
            color: "#2AF191",
            textAlign: "center",
            borderLeftColor: "#2AF191",
          },
        ],
      };
    case "L-mobile": {
      return {
        backgroundImg: {
          width: 338,
          justifyContent: "space-around",
        },
        text: [
          contentContext.styles["H1_Bebas_40"],
          {
            marginTop: 10,
            marginBottom: 45,
            color: "#2AF191",
            textAlign: "center",
            borderLeftColor: "#2AF191",
          },
        ],
      };
    }
    case "S":
      return {
        backgroundImg: {
          width: 180,
          height: 60,
          justifyContent: "space-around",
        },
        text: [
          contentContext.styles["T2_Bebas_20"],
          {
            marginBottom: 10,
            color: "#2AF191",
            textAlign: "center",
            borderLeftColor: "#2AF191",
          },
        ],
      };
  }
};
