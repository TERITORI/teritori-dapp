import {
  FlexAlignType,
  useWindowDimensions,
  View,
  ViewProps,
} from "react-native";

type RowProps = ViewProps & {
  breakpoint?: number;
  width?: string;
  alignItems?: FlexAlignType | undefined;
};

type Direction =
  | "row"
  | "column"
  | "row-reverse"
  | "column-reverse"
  | undefined;

const Row: React.FC<RowProps> = ({
  breakpoint,
  width = "100%",
  alignItems,
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
        props.style,
      ]}
    >
      {props.children}
    </View>
  );
};

export default Row;
