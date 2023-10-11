import { FlatList, View, ViewStyle } from "react-native";

import fightProgressPointerSVG from "../../../../assets/game/fight-progress-pointer.svg";
import { SVG } from "../../../components/SVG";
import {
  neutral33,
  neutral55,
  secondaryColor,
} from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";

const TOTAL_CELLS = 10;
const POINTER_SIZE = 16;

type FightProgressBarProps = {
  width: number;
  height: number;
  value: number;
  containerStyle: ViewStyle;
};

export const FightProgressBar: React.FC<FightProgressBarProps> = ({
  width,
  height,
  value,
  containerStyle,
}) => {
  const cellWidth = Math.floor(width / TOTAL_CELLS);
  const cellHeight = height;
  const cellValue = 100 / TOTAL_CELLS;

  const currentCellIndex = Math.floor(value / cellValue);

  // Convert value to pixel
  const pointerRelativePosition = (cellWidth * (value % cellValue)) / cellValue;
  // Minus size of pointer icon, add 1 just to have to correct pointer position
  const adjustedPointerRelativePosition =
    pointerRelativePosition - POINTER_SIZE + 1;

  return (
    <View style={containerStyle}>
      <FlatList
        style={{ paddingBottom: 6 }}
        data={Array(TOTAL_CELLS).fill(0)}
        scrollEnabled={false}
        numColumns={TOTAL_CELLS}
        keyExtractor={(item, index) => "" + index}
        renderItem={({ index }) => {
          let bgColor;
          if (index < currentCellIndex) {
            bgColor = secondaryColor;
          } else if (index > currentCellIndex) {
            bgColor = neutral33;
          } else {
            bgColor = neutral55;
          }

          // Allow to show pointer when reach 100%
          const isFinish = value === 100 && index === TOTAL_CELLS - 1;

          return (
            <View
              style={{
                width: cellWidth,
                height: cellHeight,
                borderColor: neutral33,
                borderRightWidth: index === TOTAL_CELLS - 1 ? 0 : 1, // No border at most right cell
                backgroundColor: bgColor,
                zIndex: -1,
                position: "relative",
                marginLeft: index === 0 ? layout.spacing_x1 : 0, // Add left margin at first cell to show pointer
                marginRight: index === TOTAL_CELLS - 1 ? layout.spacing_x1 : 0, // Add right margin at most right cell to show pointer
              }}
            >
              {pointerRelativePosition > 0 && currentCellIndex === index && (
                <View
                  style={{
                    height: cellHeight,
                    width: pointerRelativePosition,
                    backgroundColor: secondaryColor,
                  }}
                />
              )}

              {(isFinish || currentCellIndex === index) && (
                <SVG
                  style={{
                    position: "absolute",
                    zIndex: 1,
                    left: isFinish ? 2 : adjustedPointerRelativePosition, // Manually adjust position for isFinish case
                  }}
                  source={fightProgressPointerSVG}
                />
              )}
            </View>
          );
        }}
      />
    </View>
  );
};
