import { RouteProp } from "@react-navigation/native";

import { useRoute } from "./useRoute";

import { RootStackParamList } from "@/utils/navigation";

export const useAppRoute = () => useRoute<RouteProp<RootStackParamList>>();
