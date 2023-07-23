import { useNavigation } from "@react-navigation/native";

export const useCurrentRouteName = () => {
  const navigation = useNavigation();

  //@ts-ignore
  return navigation?.getCurrentRoute?.() || { name: "" };
};
