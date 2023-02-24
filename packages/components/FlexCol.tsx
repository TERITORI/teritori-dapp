import { FlexAlignType, View, ViewProps } from "react-native";

type FlexColProps = ViewProps & {
  width?: string | number;
  alignItems?: FlexAlignType | undefined;
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | undefined;
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
