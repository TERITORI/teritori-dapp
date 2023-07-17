import React, { useState, useEffect } from "react";
import { View } from "react-native";

import { TeritoriSellerQueryClient } from "../../../contracts-clients/teritori-freelance/TeritoriSeller.client";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import {
  mustGetNonSigningCosmWasmClient,
  mustGetCosmosNetwork,
} from "../../../networks";
import { useAppNavigation } from "../../../utils/navigation";
import { BrandText } from "../../BrandText";
import { Separator } from "../../Separator";
import { SecondaryButton } from "../../buttons/SecondaryButton";

export const FreelanceServicesSellerHeader: React.FC = () => {
  const navigation = useAppNavigation();
  const selectedWallet = useSelectedWallet();
  const [isSeller, setIsSeller] = useState<boolean>(true);
  // const [canCreateGig, setCanCreateGig] = useState<boolean>(false);
  const networkId = useSelectedNetworkId();

  useEffect(() => {
    const checkIsSeller = async () => {
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const network = mustGetCosmosNetwork(networkId);
      const sellerQueryClient = new TeritoriSellerQueryClient(
        cosmwasmClient,
        network.freelanceSellerAddress!
      );
      const profileHash = await sellerQueryClient.getSellerProfile(
        selectedWallet?.address!
      );
      setIsSeller(!!profileHash);
    };
    checkIsSeller();
  }, [networkId, selectedWallet]);

  return (
    <View style={{ alignItems: "center" }}>
      <BrandText style={{ fontSize: 28, alignSelf: "center", marginTop: 50 }}>
        Progress through your Efforts
      </BrandText>
      <View style={{ flexDirection: "row" }}>
        {!isSeller && (
          <SecondaryButton
            style={{ marginTop: 20, marginLeft: 20 }}
            size="SM"
            text="Become a Seller"
            onPress={() => {
              navigation.navigate("FreelanceServicesProfileSeller");
            }}
          />
        )}
      </View>
      <Separator style={{ width: 360, alignSelf: "center", marginTop: 50 }} />
    </View>
  );
};
