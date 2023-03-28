import {
  gradientColorBlue,
  gradientColorDarkerBlue,
  gradientColorTurquoise,
} from "../../../utils/style/colors";
import { PrimaryBox } from "../../boxes/PrimaryBox";

export const ToolbarContainer: React.FC = ({ children }) => {
  return (
    <PrimaryBox
      fullWidth
      height={48}
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
