import { useRoute } from "@react-navigation/native";

export const useCurrentRouteName = () => {
  const { name } = useRoute();
  return name;
};
