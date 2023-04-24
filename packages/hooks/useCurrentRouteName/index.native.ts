import { useNavigation } from "@react-navigation/native";

export const useCurrentRouteName = () => {
  const navigation = useNavigation();
  return navigation?.getCurrentRoute?.()?.name || "";
};
