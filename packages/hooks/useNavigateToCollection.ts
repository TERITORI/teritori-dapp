import { secondaryDuringMintList } from "../utils/collections";
import { useAppNavigation } from "../utils/navigation";
import { useMintEnded } from "./useMintEnded";

export const useNavigateToCollection = (
  id: string,
  forceSecondaryDuringMint: boolean
) => {
  const navigation = useAppNavigation();

  const secondaryDuringMint =
    forceSecondaryDuringMint || secondaryDuringMintList.includes(id);

  // the ternary in next line is to prevent calling the api if secondaryDuringMint
  const mintEnded = useMintEnded(secondaryDuringMint ? "" : id);

  if (secondaryDuringMint) {
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
