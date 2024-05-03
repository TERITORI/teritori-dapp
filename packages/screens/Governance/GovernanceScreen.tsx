import React, { useMemo, useState } from "react";
import { View } from "react-native";

import { StatesDropdown } from "./components/dropdowns/StatesDropdown";
import { GovernanceBox } from "../../components/GovernanceBox/GovernanceBox";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SearchInputRounded } from "@/components/sorts/SearchInputRounded";
import { useGetAllProposals } from "@/hooks/governance/useGetAllProposals";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { NetworkKind } from "@/networks";
import { fontSemibold20, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { ProposalStatus } from "@/utils/types/gov";

export const GovernanceScreen: React.FC = () => {
  const [filter, setFilter] = useState<ProposalStatus>();
  const [searchInput, setSearchInput] = useState("");
  const selectedNetworkId = useSelectedNetworkId();
  const isMobile = useIsMobile();

  const proposals = useGetAllProposals(selectedNetworkId);

  const filteredProposals = useMemo(
    () => (filter ? proposals.filter((p) => p.status === filter) : proposals),
    [filter, proposals],
  );

  return (
    <ScreenContainer
      forceNetworkKind={NetworkKind.Cosmos}
      isLarge
      headerChildren={
        <BrandText style={fontSemibold20}>Decentralized Governance</BrandText>
      }
    >
      <View
        style={{
          flexDirection: isMobile ? "column" : "row",
          marginTop: layout.spacing_x3,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <BrandText style={fontSemibold28}>Decentralized Governance</BrandText>
        <View
          style={{
            flexDirection: "row",
            gap: layout.spacing_x1_5,
            alignItems: "center",
            marginTop: isMobile ? layout.spacing_x1_5 : 0,
          }}
        >
          <SearchInputRounded
            isMobile={isMobile}
            handleChangeSearch={(text) => setSearchInput(text)}
          />
          <StatesDropdown
            onChange={setFilter}
            style={{ zIndex: 100 }}
            isMobile={isMobile}
          />
        </View>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          flexWrap: "wrap",
          marginTop: 24,
          marginRight: isMobile ? 0 : -20,
          zIndex: -1,
          marginBottom: isMobile ? 60 : 0,
        }}
      >
        {filteredProposals
          .filter((value) =>
            value.content.title
              .toLowerCase()
              .includes(searchInput.toLowerCase()),
          )
          .map((proposals) => (
            <GovernanceBox proposal={proposals} isMobile={isMobile} />
          ))}
      </View>
    </ScreenContainer>
  );
};
