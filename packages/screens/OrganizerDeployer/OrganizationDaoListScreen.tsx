import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { DaoInfo } from "../../api/dao/v1/dao";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SpacerColumn } from "../../components/spacer";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { daoClient } from "../../utils/backend";
import { useAppNavigation } from "../../utils/navigation";
import { fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { DaoItem } from "./components/DaoItem";

export const OrganizationDaoListScreen = () => {
  // variables
  const selectedWallet = useSelectedWallet();
  const navigation = useAppNavigation();
  const { setToastError } = useFeedbacks();
  const [daos, setDaos] = useState<DaoInfo[]>([]);
  //
  const onDaoItemPress = (address: string) => {
    navigation.navigate("OrganizationDaoShow", { address });
  };
  const onCreateDao = () => {
    navigation.navigate("OrganizationDeployer");
  };
  useEffect(() => {
    const getDaoList = async () => {
      if (!selectedWallet) return;
      const res = await daoClient.daoList({});
      setDaos([...res.daos]);
    };
    getDaoList();
  }, [selectedWallet, setToastError]);

  // returns
  return (
    <ScreenContainer
      headerChildren={<BrandText>DAO List</BrandText>}
      footerChildren={<></>}
      noMargin
      fullWidth
      noScroll
      isHeaderSmallMargin
    >
      <ScrollView>
        <View style={styles.container}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <BrandText style={fontSemibold28}>Featured DAOs</BrandText>
            <PrimaryButton
              size="M"
              text="Create Dao"
              touchableStyle={{ marginBottom: 20 }}
              onPress={onCreateDao}
            />
          </View>
          <SpacerColumn size={3} />
          <View style={styles.row}>
            {daos.map((item, index) => (
              <DaoItem
                key={`dao-item-${index}`}
                info={item}
                onPress={() => onDaoItemPress(item.address)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
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
