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
import { NetworkKind } from "../../networks";
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
            req={{ MemberAddress: wallet.address }}
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

const DAOsSection: React.FC<{
  networkId: string;
  title: string;
  req?: DaoListRequest;
  topRight?: React.ReactNode;
}> = ({ networkId, title, req = {}, topRight }) => {
  const navigation = useAppNavigation();
  const { daos } = useDAOs(networkId, req);
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <BrandText style={fontSemibold28}>{title}</BrandText>
        {topRight}
      </View>
      <SpacerColumn size={3} />
      <View style={styles.row}>
        {(daos || []).map((item) => (
          <DaoItem
            key={item.address}
            info={item}
            onPress={() =>
              navigation.navigate("OrganizationDaoShow", {
                address: item.address,
              })
            }
          />
        ))}
      </View>
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
    marginHorizontal: -layout.padding_x2,
    marginVertical: -layout.padding_x2,
  },
});
