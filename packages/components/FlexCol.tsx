import { ReactNode } from "react";
import { View, ViewProps, ViewStyle } from "react-native";

// TODO: remove this bloat

type FlexColProps = ViewProps & {
  width?: ViewStyle["width"];
  alignItems?: ViewStyle["alignItems"];
  justifyContent?: ViewStyle["justifyContent"];
  children?: ReactNode;
};

const FlexCol: React.FC<FlexColProps> = ({
  width = "100%",
  alignItems = "center",
  justifyContent,
  ...props
}) => {
  return (
    <View
      style={[
        {
          width,
          flexDirection: "column",
        },
        alignItems && { alignItems },
        justifyContent && { justifyContent },
        props.style,
      ]}
    >
      {props.children}
    </View>
  );
};

export default FlexCol;
