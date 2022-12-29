import { useWindowDimensions } from "react-native";

export const useIsMobile = () => {
  const { width, height } = useWindowDimensions();
  const ratio = width / height;
  return ratio < 1;
};
