import { secondaryDuringMintList } from "../utils/collections";
import { useAppNavigation } from "../utils/navigation";
import { useMintEnded } from "./useMintEnded";

export const useNavigateToCollection = (id: string) => {
  const navigation = useAppNavigation();
  const mintEnded = useMintEnded(id);
  if (secondaryDuringMintList.includes(id)) {
    return () => navigation.navigate("Collection", { id });
  }
  if (mintEnded === undefined) {
    return () => {};
  }
  if (mintEnded) {
    return () => navigation.navigate("Collection", { id });
  }
  return () => navigation.navigate("MintCollection", { id });
};
