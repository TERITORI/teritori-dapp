import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { DaoItem } from "./components/DaoItem";
import { DaoListRequest } from "../../api/dao/v1/dao";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SpacerColumn } from "../../components/spacer";
import { useDAOs } from "../../hooks/dao/useDAOs";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkKind, getUserId } from "../../networks";
import { useAppNavigation } from "../../utils/navigation";
import { fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const OrganizationDaoListScreen = () => {
  const navigation = useAppNavigation();
  const networkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();

  const onCreateDao = () => {
    navigation.navigate("OrganizationDeployer");
  };

  return (
    <ScreenContainer
      headerChildren={<BrandText>DAO List</BrandText>}
      footerChildren={<></>}
      noMargin
      fullWidth
      noScroll
      isHeaderSmallMargin
      forceNetworkKind={NetworkKind.Cosmos}
    >
      <ScrollView>
        {wallet && (
          <DAOsSection
            networkId={networkId}
            title="Your DAOs"
            req={{ memberAddress: wallet.address }}
          />
        )}
        <DAOsSection
          networkId={networkId}
          title="All DAOs"
          topRight={
            <PrimaryButton size="M" text="Create Dao" onPress={onCreateDao} />
          }
        />
      </ScrollView>
    </ScreenContainer>
  );
};

const halfGap = layout.padding_x1;

export const DAOList: React.FC<{
  networkId: string | undefined;
  req?: DaoListRequest;
}> = ({ networkId, req = {} }) => {
  const { daos } = useDAOs(networkId, req);
  return (
    <View style={styles.row}>
      {(daos || []).map((item) => (
        <DaoItem
          key={item.address}
          userId={getUserId(networkId, item.address)}
          style={{
            marginHorizontal: halfGap,
            marginVertical: halfGap,
          }}
        />
      ))}
    </View>
  );
};

const DAOsSection: React.FC<{
  networkId: string | undefined;
  title: string;
  req?: DaoListRequest;
  topRight?: React.ReactNode;
}> = ({ networkId, title, req, topRight }) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <BrandText style={fontSemibold28}>{title}</BrandText>
        {topRight}
      </View>
      <SpacerColumn size={3} />
      <DAOList networkId={networkId} req={req} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: layout.contentPadding,
    paddingTop: layout.topContentPaddingWithHeading,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -halfGap,
    marginVertical: -halfGap,
  },
});
