import { useNavigation } from "@react-navigation/native";

export const useRoute = () => {
  const navigation = useNavigation();

  // @ts-expect-error: description todo
  return navigation?.getCurrentRoute?.() || { name: "" };
};
