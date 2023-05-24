import { useQuery } from "@tanstack/react-query";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { CopyToClipboard } from "../../../components/CopyToClipboard";
import { OptimizedImage } from "../../../components/OptimizedImage";
import { SpacerColumn } from "../../../components/spacer";
import { Cw4GroupQueryClient } from "../../../contracts-clients/cw4-group/Cw4Group.client";
import { DaoCoreQueryClient } from "../../../contracts-clients/dao-core/DaoCore.client";
import { DaoVotingCw4QueryClient } from "../../../contracts-clients/dao-voting-cw4/DaoVotingCw4.client";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import {
  getCosmosNetwork,
  getUserId,
  mustGetNonSigningCosmWasmClient,
} from "../../../networks";
import { useAppNavigation } from "../../../utils/navigation";
import { neutral33, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";

export const DaoMemberList: React.FC<{
  networkId: string;
  daoAddr: string;
}> = ({ networkId, daoAddr }) => {
  const { data: members } = useQuery(
    ["daoMembers", networkId, daoAddr],
    async () => {
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const daoCoreClient = new DaoCoreQueryClient(cosmwasmClient, daoAddr);
      const votingModuleAddress = await daoCoreClient.votingModule();
      const votingModuleClient = new DaoVotingCw4QueryClient(
        cosmwasmClient,
        votingModuleAddress
      );
      const cw4Address = await votingModuleClient.groupContract();
      const cw4Client = new Cw4GroupQueryClient(cosmwasmClient, cw4Address);
      const { members } = await cw4Client.listMembers({});
      return members;
    }
  );
  if (!members) {
    return null;
  }
  return (
    <View style={styles.container}>
      <BrandText style={[fontSemibold14, { paddingLeft: 10 }]}>
        {members.length} members
      </BrandText>
      <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
        {members.map((member) => (
          <MemberView
            key={member.addr}
            networkId={networkId}
            addr={member.addr}
            weight={member.weight}
          />
        ))}
      </View>
    </View>
  );
};

const MemberView: React.FC<{
  networkId: string;
  addr: string;
  weight: number;
}> = ({ networkId, addr, weight }) => {
  const userId = getUserId(networkId, addr);
  const { metadata } = useNSUserInfo(userId);
  const network = getCosmosNetwork(networkId);
  const navigation = useAppNavigation();
  const imageSize = 100;
  return (
    <View style={styles.memberItem}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <OptimizedImage
          source={{
            uri: metadata.image || network?.nameServiceDefaultImage,
          }}
          width={imageSize}
          height={imageSize}
          style={{ width: imageSize, height: imageSize }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          height: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <BrandText>{metadata.public_name || "Anon"}</BrandText>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("UserPublicProfile", { id: userId });
        }}
      >
        <View
          style={{
            flexDirection: "row",
            height: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BrandText>{metadata.tokenId || "No registered name"}</BrandText>
        </View>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          height: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CopyToClipboard text={addr} />
      </View>
      <View style={{ flexDirection: "column", margin: 20 }}>
        <SpacerColumn size={2} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <BrandText style={styles.textGrayStyle}>Weight</BrandText>
          <BrandText style={[fontSemibold14]}>{weight}</BrandText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flexDirection: "column",
    borderTopWidth: 1,
    borderColor: neutral33,
  },
  memberItem: {
    flexDirection: "column",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: neutral33,
    width: 250,
    margin: 10,
    padding: 10,
  },
  textGrayStyle: StyleSheet.flatten([
    fontSemibold14,
    {
      color: secondaryColor,
      opacity: 0.5,
    },
  ]),
});
