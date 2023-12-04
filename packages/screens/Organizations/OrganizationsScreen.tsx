import React from "react";
import { ScrollView, View } from "react-native";

import { DAOsRequest } from "../../api/dao/v1/dao";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { DAOsList } from "../../components/dao/DAOsList";
import { SpacerColumn } from "../../components/spacer";
import { useForceNetworkSelection } from "../../hooks/useForceNetworkSelection";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { NetworkFeature } from "../../networks";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const OrganizationsScreen: ScreenFC<"Organizations"> = ({
  route: { params },
}) => {
  useForceNetworkSelection(params?.network);
  const navigation = useAppNavigation();
  const networkId = useSelectedNetworkId();

  return (
    <ScreenContainer
      headerChildren={<BrandText>DAO List</BrandText>}
      footerChildren={<></>}
      noMargin
      fullWidth
      forceNetworkFeatures={[NetworkFeature.Organizations]}
    >
      <ScrollView contentContainerStyle={{ width: "100%" }}>
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
      </ScrollView>
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
        paddingHorizontal: layout.contentSpacing,
        paddingTop: layout.topContentSpacingWithHeading,
        width: "100%",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <BrandText style={fontSemibold28}>{title}</BrandText>
        {topRight}
      </View>
      <SpacerColumn size={3} />
      <DAOsList req={req} />
    </View>
  );
};
