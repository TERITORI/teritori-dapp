import { useRoute } from "@react-navigation/native";
import React, { useMemo } from "react";
import { View } from "react-native";

import { MilestonesUpdateManager } from "./MilestonesUpdateManager";
import { MyInvestmentsManager } from "./MyInvestmentsManager";
import { MyProjectsManager } from "./MyProjectsManager";
import { Requests } from "./Requests";
import { TabOption, ViewKey } from "./types";
import { BrandText } from "../../../components/BrandText";
import { FlexRow } from "../../../components/FlexRow";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { Tabs } from "../../../components/tabs/Tabs";
import { ScreenFC, useAppNavigation } from "../../../utils/navigation";
import { neutral33 } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { HeaderBackButton } from "../components/HeaderBackButton";

const TAB_OPTIONS: TabOption = {
  myInvestments: {
    name: "My investments",
    component: <MyProjectsManager type="myInvestments" />,
  },
  myProjects: {
    name: "My projects",
    component: <MyProjectsManager type="myProjects" />,
  },
  milestonesUpdates: {
    name: "Milestones Updates",
    component: <MilestonesUpdateManager />,
  },
  requestsByBuilders: {
    name: "Requests by builders",
    component: <Requests type="requestsByBuilders" />,
  },
  requestsByInvestors: {
    name: "Requests by investors",
    component: <Requests type="requestsByInvestors" />,
  },
};

const MANAGER_TYPES = Object.keys(TAB_OPTIONS);

export const ProjectsManagerScreen: ScreenFC<"ProjectsManager"> = () => {
  const navigation = useAppNavigation();
  const { params } = useRoute();
  const viewFromParams = (params as any).view;

  const view: ViewKey = useMemo(() => {
    return MANAGER_TYPES.includes(viewFromParams)
      ? viewFromParams
      : "myInvestments";
  }, [viewFromParams]);

  return (
    <ScreenContainer isLarge responsive headerChildren={<HeaderBackButton />}>
      <FlexRow
        style={{
          marginTop: layout.spacing_x4,
          justifyContent: "space-between",
        }}
      >
        <BrandText style={fontSemibold28}>{TAB_OPTIONS[view].name}</BrandText>

        <Tabs
          items={TAB_OPTIONS}
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
        {TAB_OPTIONS[view].component}
      </View>
    </ScreenContainer>
  );
};
