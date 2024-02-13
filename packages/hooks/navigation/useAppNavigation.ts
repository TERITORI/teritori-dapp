import { useNavigation } from "@react-navigation/native";

import { AppNavigationProp } from "@/utils/navigation";

export const useAppNavigation = () => useNavigation<AppNavigationProp>();
