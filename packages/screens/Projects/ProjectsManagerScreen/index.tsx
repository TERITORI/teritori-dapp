import React, { useMemo } from "react";
import { View } from "react-native";

import { MilestonesUpdateManager } from "./MilestonesUpdateManager";
import { MyProjectsManager } from "./MyProjectsManager";
import { Requests } from "./Requests";
import { TabOption, ViewKey } from "./types";
import { HeaderBackButton } from "../components/HeaderBackButton";

import { BrandText } from "@/components/BrandText";
import { FlexRow } from "@/components/FlexRow";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Tabs } from "@/components/tabs/Tabs";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { NetworkKind } from "@/networks";
import { ContractorCandidates } from "@/screens/Projects/ProjectsManagerScreen/ContractorCandidates";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import { neutral33 } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { arrayIncludes, objectKeys } from "@/utils/typescript";

export const ProjectsManagerScreen: ScreenFC<"ProjectsManager"> = ({
  route: { params },
}) => {
  const networkId = useSelectedNetworkId();
  const navigation = useAppNavigation();
  const viewFromParams = params.view;

  const { tabOptions, managerTypes } = useMemo(() => {
    const tabOptions: TabOption = {
      myInvestments: {
        name: "My investments",
        component: <MyProjectsManager type="myInvestments" />,
      },
      myProjects: {
        name: "My projects",
        component: <MyProjectsManager type="myProjects" />,
      },
      milestonesUpdates: {
        name: "Reviews",
        component: <MilestonesUpdateManager />,
      },
      requestsByBuilders: {
        name: "Contractor candidates",
        component: <ContractorCandidates networkId={networkId} />,
      },
      requestsByInvestors: {
        name: "Requests by investors",
        component: <Requests type="requestsByInvestors" />,
      },
    };
    return { tabOptions, managerTypes: objectKeys(tabOptions) };
  }, [networkId]);

  const view: ViewKey = useMemo(() => {
    return arrayIncludes(managerTypes, viewFromParams)
      ? viewFromParams
      : "myInvestments";
  }, [managerTypes, viewFromParams]);

  return (
    <ScreenContainer
      forceNetworkKind={NetworkKind.Gno}
      isLarge
      responsive
      headerChildren={<HeaderBackButton />}
    >
      <FlexRow
        style={{
          marginTop: layout.spacing_x4,
          justifyContent: "space-between",
        }}
      >
        <BrandText style={fontSemibold28}>{tabOptions[view].name}</BrandText>

        <Tabs
          items={tabOptions}
          selected={view}
          onSelect={(tab) =>
            navigation.navigate("ProjectsManager", { view: tab })
          }
          tabTextStyle={fontSemibold14}
        />
      </FlexRow>

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: neutral33,
          marginTop: layout.spacing_x2,
          paddingTop: layout.spacing_x2,
        }}
      >
        {tabOptions[view].component}
      </View>
    </ScreenContainer>
  );
};
