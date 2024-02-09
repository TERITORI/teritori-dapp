import { useState } from "react";
import { View } from "react-native";
import { useClickOutside } from "react-native-click-outside";

type HookConfig = {
  triggerOnUnmount?: boolean;
  triggerOnBlur?: boolean;
};

export const useDropdowns = <T = View>({
  config,
  callback,
}: {
  config?: HookConfig;
  callback?: (val: boolean) => void;
} = {}): [boolean, (value?: boolean) => void, React.RefObject<T>] => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const ref = useClickOutside<T>(() => {
    setIsDropdownOpen(false);
    callback?.(false);
  }, config);

  const setDropdownState = (value?: boolean) => {
    setIsDropdownOpen(value ?? true);
  };

  return [isDropdownOpen, setDropdownState, ref];
};
