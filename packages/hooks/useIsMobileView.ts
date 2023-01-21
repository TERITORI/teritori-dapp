import { useWindowDimensions } from "react-native";
import { mobileWidth } from "../utils/style/layout";

export const useIsMobileView = () => {
  const { width: windowWidth } = useWindowDimensions();  

  return windowWidth <= mobileWidth;
};
