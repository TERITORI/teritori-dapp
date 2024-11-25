import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useNFTBurnerTotal } from "@/hooks/nft-burner/useNFTBurnerTotal";
import { useNFTBurnerUserCount } from "@/hooks/nft-burner/useNFTBurnerUserCount";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { teritoriNetwork } from "@/networks/teritori";
import { ScreenFC } from "@/utils/navigation";

export const BurnCapitalScreen: ScreenFC<"BurnCapital"> = ({ route }) => {
  const inputNetwork = route.params?.network || teritoriNetwork.id;
  const selectedWallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();
  const { data: count } = useNFTBurnerUserCount(selectedWallet?.userId);
  const { data: total } = useNFTBurnerTotal(selectedNetworkId);
  return (
    <ScreenContainer fullWidth forceNetworkId={inputNetwork}>
      <BrandText>Burn Capital</BrandText>
      {typeof total === "number" && (
        <BrandText>Total burned: {total}</BrandText>
      )}
      {typeof count === "number" && (
        <BrandText>Burned by you: {count}</BrandText>
      )}
    </ScreenContainer>
  );
};
