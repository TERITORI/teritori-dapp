import { useWindowDimensions, View, ViewProps, ViewStyle } from "react-native";

// TODO: remove this bloat

type FlexRowProps = ViewProps & {
  breakpoint?: number;
  width?: ViewStyle["width"];
  alignItems?: ViewStyle["alignItems"];
  justifyContent?: ViewStyle["justifyContent"];
};

type Direction =
  | "row"
  | "column"
  | "row-reverse"
  | "column-reverse"
  | undefined;

const FlexRow: React.FC<FlexRowProps> = ({
  breakpoint,
  width = "100%",
  alignItems = "center",
  justifyContent,
  ...props
}) => {
  const { width: currentWidth } = useWindowDimensions();

  let flexDirection: Direction = "row";
  if (breakpoint && currentWidth < breakpoint) {
    flexDirection = "column";
  }

  return (
    <View
      style={[
        {
          width,
          flexDirection,
        },
        flexDirection === "column" && { alignItems: "center" },
        alignItems && { alignItems },
        justifyContent && { justifyContent },
        props.style,
      ]}
    >
      {props.children}
    </View>
  );
};

export default FlexRow;
