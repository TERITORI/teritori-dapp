import React, { useState, useEffect } from "react";
import { View } from "react-native";

import { useWallets } from "../../../context/WalletsProvider";
import { getSellerIpfsHash } from "../../../screens/FreelanceServices/contract";
import { useAppNavigation } from "../../../utils/navigation";
import { BrandText } from "../../BrandText";
import { Separator } from "../../Separator";
import { SecondaryButton } from "../../buttons/SecondaryButton";

export const FreelanceServicesSellerHeader: React.FC = () => {
  const navigation = useAppNavigation();
  const { wallets } = useWallets();
  const [isSeller, setIsSeller] = useState<boolean>(true);
  // const [canCreateGig, setCanCreateGig] = useState<boolean>(false);

  useEffect(() => {
    const checkIsSeller = async (address: string) => {
      
      const ipfs_hash = await getSellerIpfsHash(address);
      setIsSeller(!!ipfs_hash);
    };
    if (wallets.length > 0) {
      checkIsSeller(wallets[0].address);
      // setCanCreateGig(true);
    }
  }, [wallets]);

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
