import { StyleProp, View, ViewStyle, Text } from "react-native";

import { useContentContext } from "../../context/ContentProvider";

export interface ButtonLabelType {
  text: string;
  size: "S" | "Mobile";
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  actionable?: boolean;
}

export const ButtonLabel: React.FC<ButtonLabelType> = ({
  text,
  size,
  style,
  onPress,
  actionable = false,
}) => {
  const buttonStyles = useStyles(size);
  const buttonActionableStyle = actionable
    ? ({
        borderColor: "#28f191",
        borderStyle: "solid",
      } as StyleProp<ViewStyle>)
    : {};

  return (
    <View
      style={[
        {
          width: size === "Mobile" ? 160 : 238,
          height: "fit-content",
          borderRadius: 5,
          backgroundColor: "#212708",
          borderWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
        },
        buttonActionableStyle,
        style,
      ]}
    >
      <Text onPress={onPress} style={buttonStyles?.text}>
        {text}
      </Text>
    </View>
  );
};

const useStyles = (size: ButtonLabelType["size"]) => {
  const contentContext = useContentContext();
  switch (size) {
    case "S":
      return {
        text: [
          contentContext.styles["T1_Bebas_20"],
          {
            color: "#E8E1EF",
            textAlign: "center",
            borderLeftColor: "#2AF191",
            lineHeight: "normal",
          },
        ],
      };
    case "Mobile":
      return {
        text: [
          contentContext.styles["T1_Bebas_15"],
          {
            color: "#E8E1EF",
            textAlign: "center",
            borderLeftColor: "#2AF191",
            lineHeight: "normal",
          },
        ],
      };
  }
};
