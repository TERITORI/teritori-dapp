import { SwitchProps, Switch } from "react-native";

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
  disabled,
  ...rest
}: ToggleButtonProps) {
  function onValueChangeHandler(value: boolean) {
    if (!onValueChange) {
      return;
    }

    onValueChange(value);
  }

  const getIOSBackgroundColor = () => {
    if (disabled) {
      return isActive ? neutral99 : neutral33;
    }

    return isActive ? blueDefault : neutral33;
  };

  return (
    <Switch
      // @ts-expect-error: the active thumb color is a weird green on web that can't be changed without "activeThumbColor"
      activeThumbColor={secondaryColor}
      trackColor={{ false: neutral33, true: blueDefault }}
      thumbColor={isActive ? secondaryColor : neutral99}
      ios_backgroundColor={getIOSBackgroundColor()}
      value={isActive}
      onValueChange={onValueChangeHandler}
      style={{ transform: [{ scale: 0.8 }] }}
      disabled={disabled}
      {...rest}
    />
  );
}
