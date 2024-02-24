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
      return neutral99;
    }

    return isActive ? blueDefault : neutral33;
  };

  return (
    <Switch
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
