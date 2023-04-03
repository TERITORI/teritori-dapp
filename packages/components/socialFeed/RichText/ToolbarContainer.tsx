import { useWindowDimensions } from "react-native";

import {
  gradientColorBlue,
  gradientColorDarkerBlue,
  gradientColorTurquoise,
} from "../../../utils/style/colors";
import { PrimaryBox } from "../../boxes/PrimaryBox";

export const ToolbarContainer: React.FC = ({ children }) => {
  const { width } = useWindowDimensions();

  return (
    <PrimaryBox
      fullWidth
      height={width < 959 ? (width < 380 ? 108 : 84) : 48}
      colors={[
        gradientColorDarkerBlue,
        gradientColorBlue,
        gradientColorTurquoise,
      ]}
      style={{ flex: 1 }}
      mainContainerStyle={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </PrimaryBox>
  );
};
