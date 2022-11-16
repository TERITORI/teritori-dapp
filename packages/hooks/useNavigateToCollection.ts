import { useAppNavigation } from "../utils/navigation";
import { useMintEnded } from "./useMintEnded";

// FIXME: use contract parameter instead of hardcoded list

const noSecondaryDuringMintList = [
  "tori-tori1999u8suptza3rtxwk7lspve02m406xe7l622erg3np3aq05gawxsrh9g0p",
  `tori-${process.env.THE_RIOT_COLLECTION_ADDRESS}`,
];

export const useNavigateToCollection = (id: string) => {
  const navigation = useAppNavigation();
  const mintEnded = useMintEnded(id);
  if (!noSecondaryDuringMintList.includes(id)) {
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
