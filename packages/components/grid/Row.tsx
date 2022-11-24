import { useWindowDimensions, View, ViewProps } from "react-native";

type RowProps = ViewProps & {
  breakpoint?: number;
};

type Direction =
  | "row"
  | "column"
  | "row-reverse"
  | "column-reverse"
  | undefined;

const Row: React.FC<RowProps> = (props) => {
  const { width } = useWindowDimensions();

  let flexDirection: Direction = "row";
  if (props.breakpoint && width < props.breakpoint) {
    flexDirection = "column";
  }

  return (
    <View
      style={[
        {
          width: "100%",
          flexDirection,
        },
        flexDirection === "column" && { alignItems: "center" },
        props.style,
      ]}
    >
      {props.children}
    </View>
  );
};

export default Row;
