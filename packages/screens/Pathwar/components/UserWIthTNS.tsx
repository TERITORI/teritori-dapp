import React from "react";
import { View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { OmniLink } from "../../../components/OmniLink";
import { OptimizedImage } from "../../../components/OptimizedImage";
import { shortUserAddressFromID } from "../../../components/nfts/NFTView";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import { getCosmosNetwork } from "../../../networks";
import { neutral77 } from "../../../utils/style/colors";

export const UserWIthTNS: React.FC<{ address: string }> = ({ address }) => {
  // todo resolve user address network
  const userInfo = useNSUserInfo(address);
  const cosmosNetwork = getCosmosNetwork("teritori");

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <OptimizedImage
        sourceURI={userInfo.metadata.image}
        fallbackURI={cosmosNetwork?.nameServiceDefaultImage}
        width={32}
        height={32}
        style={{
          height: 32,
          width: 32,
          borderRadius: 18,
          marginRight: 6,
        }}
      />
      <OmniLink
        to={{
          screen: "UserPublicProfile",
          params: { id: address },
        }}
      >
        <BrandText
          style={{
            fontSize: 10,
            color: neutral77,
          }}
        >
          Owned by
        </BrandText>
        <BrandText
          style={{
            fontSize: 12,
            lineHeight: 16,
          }}
        >
          {userInfo.metadata?.tokenId || shortUserAddressFromID(address, 10)}
        </BrandText>
      </OmniLink>
    </View>
  );
};
