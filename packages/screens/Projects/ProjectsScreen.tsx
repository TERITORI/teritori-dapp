import React, { useState } from "react";
import { View } from "react-native";

import { ProjectBox } from "./components/ProjectBox";
import { ProjectsStatusFilterButtons } from "./components/ProjectsStatusFilterButtons";
import { useProjects } from "./hooks/useProjects";
import { ContractStatusFilter } from "./types";
import { BrandText } from "../../components/BrandText";
import { FlexRow } from "../../components/FlexRow";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SimpleButton } from "../../components/buttons/SimpleButton";
import { Separator } from "../../components/separators/Separator";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { NetworkKind, getNetwork } from "../../networks";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { primaryColor, secondaryColor } from "../../utils/style/colors";
import { fontSemibold20, fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

import { GridList } from "@/components/layout/GridList";
import { useForceNetworkSelection } from "@/hooks/useForceNetworkSelection";
import { joinElements } from "@/utils/react";

export const ProjectsScreen: ScreenFC<"Projects"> = ({ route: { params } }) => {
  const network = params?.network;
  useForceNetworkSelection(network);
  const networkId = useSelectedNetworkId();
  const inputNetwork = getNetwork(network);
  const { projects, fetchNextPage } = useProjects(networkId);

  const navigation = useAppNavigation();

  const gotoProjectsManager = () => {
    navigation.navigate("ProjectsManager", { view: "myInvestments" });
  };

  const gotoCreateGrant = () => {
    navigation.navigate("ProjectsMakeRequest", { step: 1 });
  };

  const [statusFilter, setStatusFilter] = useState<ContractStatusFilter>("ALL");

  const topRightElems = [
    <SimpleButton
      outline
      text="Projects Manager"
      color={secondaryColor}
      size="SM"
      onPress={gotoProjectsManager}
    />,
    <SimpleButton
      outline
      text="Create a Project"
      color={primaryColor}
      size="SM"
      onPress={gotoCreateGrant}
    />,
  ];

  return (
    <ScreenContainer
      forceNetworkKind={inputNetwork ? undefined : NetworkKind.Gno}
      isLarge
      responsive
      footerChildren={<></>}
      headerChildren={<BrandText style={fontSemibold20}>Projects</BrandText>}
    >
      <GridList
        ListHeaderComponent={
          <>
            <FlexRow style={{ marginTop: layout.spacing_x4 }}>
              <BrandText style={[fontSemibold28, { flexGrow: 1 }]}>
                Projects
              </BrandText>
              {joinElements(topRightElems, <SpacerRow size={2} />)}
            </FlexRow>
            <Separator style={{ marginVertical: layout.spacing_x2 }} />
            <View
              style={{
                marginBottom: layout.spacing_x2,
              }}
            >
              <ProjectsStatusFilterButtons
                status={statusFilter}
                onChange={setStatusFilter}
              />
            </View>
          </>
        }
        ListFooterComponent={<SpacerColumn size={4} />}
        data={projects}
        keyExtractor={(project) => project.id}
        minElemWidth={400}
        onEndReached={() => fetchNextPage()}
        renderItem={({ item: project }, elemWidth) => {
          return (
            <ProjectBox key={project.id} project={project} width={elemWidth} />
          );
        }}
      />
    </ScreenContainer>
  );
};
