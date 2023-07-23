import { useRoute } from "@react-navigation/native";

export const useCurrentRouteName = () => {
  return useRoute();
};
