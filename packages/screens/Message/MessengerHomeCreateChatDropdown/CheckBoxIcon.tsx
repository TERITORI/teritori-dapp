import React from "react";
import Svg, { Path } from "react-native-svg";

interface CustomIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const CustomIcon: React.FC<CustomIconProps> = ({
  width = 40,
  height = 24,
  color = "#000000",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22ZM11 7H13V13H11V7ZM11 15H13V17H11V15Z"
        fill={color}
      />
    </Svg>
  );
};

export default CustomIcon;
