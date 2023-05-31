import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { DaoItem } from "./components/DaoItem";
import { DAOsRequest } from "../../api/dao/v1/dao";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SpacerColumn } from "../../components/spacer";
import { useDAOs } from "../../hooks/dao/useDAOs";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { NetworkKind, getUserId } from "../../networks";
import { useAppNavigation } from "../../utils/navigation";
import { fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const OrganizationDaoListScreen = () => {
  const navigation = useAppNavigation();
  const networkId = useSelectedNetworkId();

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
      forceNetworkKind={NetworkKind.Cosmos}
    >
      <ScrollView>
        <DAOsSection
          req={{ networkId }}
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
  req: Partial<DAOsRequest>;
}> = ({ req }) => {
  const { daos } = useDAOs(req);
  return (
    <View style={styles.row}>
      {(daos || []).map((item) => (
        <DaoItem
          key={item.contractAddress} // TODO: use id
          userId={getUserId(req.networkId, item.contractAddress)}
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
  title: string;
  req: Partial<DAOsRequest>;
  topRight?: React.ReactNode;
}> = ({ title, req, topRight }) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <BrandText style={fontSemibold28}>{title}</BrandText>
        {topRight}
      </View>
      <SpacerColumn size={3} />
      <DAOList req={req} />
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
