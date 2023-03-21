import { StyleProp, View, ViewStyle, Text } from "react-native";

import { useContentContext } from "../../context/ContentProvider";

export interface ButtonLabelType {
  text: string;
  size: "S" | "L";
  style?: StyleProp<ViewStyle>;
}

export const ButtonLabel: React.FC<ButtonLabelType> = ({
  text,
  size,
  style,
}) => {
  const buttonStyles = useStyles(size);

  return (
    <View
      style={[
        {
          width: 238,
          height: "fit-content",
          borderRadius: 5,
          backgroundColor: "#212708",
          paddingTop: 8,
          paddingBottom: 8,
        },
        style,
      ]}
    >
      <Text style={buttonStyles?.text}>{text}</Text>
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
  }
};
