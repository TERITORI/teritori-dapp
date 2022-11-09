import { useAppNavigation } from "../utils/navigation";
import { useMintEnded } from "./useMintEnded";

export const useNavigateToCollection = (id: string) => {
  const navigation = useAppNavigation();
  const mintEnded = useMintEnded(id);
  if (
    id !== `tori-${process.env.THE_RIOT_COLLECTION_ADDRESS}` ||
    id !== `tori-${process.env.TORIPUNKS_COLLECTION_ADDRESS}`
  ) {
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
