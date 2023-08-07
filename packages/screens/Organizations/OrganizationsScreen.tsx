import React from "react";
import { View } from "react-native";

import { DAOsRequest } from "../../api/dao/v1/dao";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { DAOsList } from "../../components/dao/DAOsList";
import { SpacerColumn } from "../../components/spacer";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { NetworkFeature } from "../../networks";
import { useAppNavigation } from "../../utils/navigation";
import { fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const OrganizationsScreen = () => {
  const navigation = useAppNavigation();
  const networkId = useSelectedNetworkId();

  return (
    <ScreenContainer
      isLarge
      headerChildren={<BrandText>DAO List</BrandText>}
      footerChildren={<></>}
      responsive
      forceNetworkFeatures={[NetworkFeature.Organizations]}
    >
      <DAOsSection
        req={{ networkId }}
        title="All DAOs"
        topRight={
          <PrimaryButton
            text="Create Dao"
            onPress={() => navigation.navigate("OrganizationDeployer")}
          />
        }
      />
    </ScreenContainer>
  );
};

const DAOsSection: React.FC<{
  title: string;
  req: Partial<DAOsRequest>;
  topRight?: React.ReactNode;
}> = ({ title, req, topRight }) => {
  return (
    <View
      style={{
        paddingBottom: layout.contentPadding,
        paddingTop: layout.topContentPaddingWithHeading,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <BrandText style={fontSemibold28}>{title}</BrandText>
        {topRight}
      </View>
      <SpacerColumn size={3} />
      <DAOsList req={req} />
    </View>
  );
};
