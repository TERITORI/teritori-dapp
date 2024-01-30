import { useNavigation } from "expo-router";

export const useRoute = () => {
  const navigation = useNavigation();

  //@ts-ignore
  return navigation?.getCurrentRoute?.() || { name: "" };
};
