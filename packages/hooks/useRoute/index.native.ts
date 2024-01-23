import { useNavigation } from "@react-navigation/native";

export const useRoute = () => {
  const navigation = useNavigation();

  //@ts-ignore
  return navigation?.getCurrentRoute?.() || { name: "" };
};
