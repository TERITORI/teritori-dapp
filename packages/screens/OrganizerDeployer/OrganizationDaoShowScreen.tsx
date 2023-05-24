import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Image } from "react-native";

import { DaoMemberList } from "./components/DaoMemberList";
import { DaoProposalList } from "./components/DaoProposalList";
import { BrandText } from "../../components/BrandText";
import { CopyToClipboard } from "../../components/CopyToClipboard";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SpacerColumn } from "../../components/spacer";
import { Tabs } from "../../components/tabs/Tabs";
import { useBalances } from "../../hooks/useBalances";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { NetworkKind, getCosmosNetwork, getUserId } from "../../networks";
import { prettyPrice } from "../../utils/coins";
import { ScreenFC } from "../../utils/navigation";
import { neutral33, secondaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

const CONTAINER_MARGIN_HORIZONTAL = 32;

export const OrganizationDaoShowScreen: ScreenFC<"OrganizationDaoShow"> = ({
  route: {
    params: { address },
  },
}) => {
  const networkId = useSelectedNetworkId();
  const network = getCosmosNetwork(networkId);
  const userInfo = useNSUserInfo(getUserId(networkId, address));
  const balances = useBalances(networkId, address);

  const tabs = {
    proposals: {
      name: "Proposals",
    },
    members: {
      name: "Members",
    },
  };
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof tabs>("proposals");
  const name = userInfo?.metadata.tokenId
    ? `${userInfo.metadata.public_name} - ${userInfo.metadata.tokenId}`
    : "Anon DAO";
  // returns
  return (
    <ScreenContainer
      headerChildren={<BrandText>{name}</BrandText>}
      footerChildren={<></>}
      noScroll
      isHeaderSmallMargin
      forceNetworkKind={NetworkKind.Cosmos}
    >
      <ScrollView style={styles.container}>
        <View
          style={{
            paddingBottom: layout.padding_x2_5,
            borderBottomWidth: 1,
            borderColor: neutral33,
          }}
        >
          <View style={[styles.row, { marginTop: layout.padding_x2_5 }]}>
            <Image
              source={{
                uri:
                  userInfo?.metadata.image || network?.nameServiceDefaultImage, // FIXME: fallback image
              }}
              style={styles.image}
            />
          </View>
          <SpacerColumn size={3} />
          <View style={styles.row}>
            <BrandText style={styles.text}>{name}</BrandText>
          </View>
          <SpacerColumn size={3} />
          <View style={styles.row}>
            <BrandText style={styles.textGray}>
              {userInfo.metadata.public_bio}
            </BrandText>
          </View>
          <SpacerColumn size={3} />
          <View style={{ flexDirection: "row" }}>
            <View style={styles.item}>
              <BrandText style={styles.textGray}>Dao's address</BrandText>
              <SpacerColumn size={2} />
              <CopyToClipboard text={address} />
            </View>
            <View style={styles.item}>
              <BrandText style={styles.textGray}>DAO Treasury</BrandText>
              <SpacerColumn size={2} />
              {balances.map((b, index) => (
                <>
                  {index !== 0 && <SpacerColumn size={1} />}
                  <BrandText style={styles.text}>
                    {prettyPrice(networkId, b.amount || "0", b.denom || "")}
                  </BrandText>
                </>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <Tabs
            items={tabs}
            onSelect={setSelectedTab}
            style={{ height: 44 }}
            selected={selectedTab}
          />
        </View>
        {selectedTab === "proposals" && (
          <DaoProposalList daoAddress={address} />
        )}
        {selectedTab === "members" && (
          <DaoMemberList networkId={networkId} daoAddr={address} />
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginHorizontal: CONTAINER_MARGIN_HORIZONTAL,
    marginTop: layout.padding_x2_5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  item: {
    flexGrow: 1,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 9999,
    padding: 4,
  },
  text: StyleSheet.flatten([
    fontSemibold14,
    {
      color: secondaryColor,
    },
  ]),
  textGray: StyleSheet.flatten([
    fontSemibold14,
    {
      color: secondaryColor,
      opacity: 0.5,
    },
  ]),
});
