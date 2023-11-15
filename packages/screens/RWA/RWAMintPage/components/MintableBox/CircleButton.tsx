import { TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";

import { SVG } from "../../../../../components/SVG";
import { useIsLightTheme, useTheme } from "../../../../../hooks/useTheme";
import { neutral30 } from "../../../../../utils/style/colors";

type CircleButtonProps = {
  onPress: () => void;
  icon: React.FC<SvgProps>;
};

export const CircleButton: React.FC<CircleButtonProps> = ({
  onPress,
  icon,
}) => {
  const theme = useTheme();
  const isLightTheme = useIsLightTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderRadius: 40,
        borderWidth: isLightTheme ? 1 : 0,
        borderColor: "#D2D2D7",
        backgroundColor: isLightTheme ? theme.backgroundColor : neutral30,
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SVG source={icon} color={theme.primaryButtonColor} />
    </TouchableOpacity>
  );
};
