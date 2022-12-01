import { View, ViewProps } from "react-native";

type ColProps = ViewProps & {
  size?: number;
};

const TOTAL_COLUMN = 12;

// Pre-calculate size for performance

const WIDTH_MAP = Array.from(Array(TOTAL_COLUMN).keys()).reduce(
  (accumulator: any, value) => {
    const colSize = value + 1;
    accumulator[colSize] = Math.round((colSize * 10000) / TOTAL_COLUMN) / 100;
    return accumulator;
  },
  {}
);

const Col: React.FC<ColProps> = ({ size, ...props }) => {
  let style = props.style as object;

  if (size) {
    style = [{ width: `${WIDTH_MAP[size]}%` }, style];
  }

  return (
    <View {...props} style={style}>
      {props.children}
    </View>
  );
};

export default Col;
