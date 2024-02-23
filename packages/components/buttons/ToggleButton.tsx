import { SwitchProps } from "react-native";
import { Switch } from "react-native-gesture-handler";

import {
  blueDefault,
  neutral33,
  neutral99,
  secondaryColor,
} from "@/utils/style/colors";

interface ToggleButtonProps extends SwitchProps {
  isActive?: boolean;
  onValueChange?: (value: boolean) => void;
}

export default function ToggleButton({
  isActive = false,
  onValueChange,
  ...rest
}: ToggleButtonProps) {
  function onValueChangeHandler(value: boolean) {
    if (!onValueChange) {
      return;
    }

    onValueChange(value);
  }

  return (
    <Switch
      // @ts-expect-error: the active thumb color is a weird green that can't be changed without "activeThumbColor"
      activeThumbColor={secondaryColor}
      trackColor={{ false: neutral33, true: blueDefault }}
      thumbColor={!isActive ? neutral99 : secondaryColor}
      ios_backgroundColor={isActive ? blueDefault : neutral33}
      value={isActive}
      onValueChange={onValueChangeHandler}
      style={{ transform: [{ scale: 0.8 }] }}
      {...rest}
    />
  );
}
