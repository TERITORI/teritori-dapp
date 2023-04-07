import {
  FlexAlignType,
  useWindowDimensions,
  View,
  ViewProps,
} from "react-native";

type FlexRowProps = ViewProps & {
  breakpoint?: number;
  width?: string;
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
