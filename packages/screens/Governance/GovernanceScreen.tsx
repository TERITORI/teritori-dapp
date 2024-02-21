import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import { PeriodDropdown } from "./components/dropdowns/PeriodDropdown";
import { ProposalsDropdown } from "./components/dropdowns/ProposalsDropdown";
import { GovernanceBox } from "../../components/GovernanceBox/GovernanceBox";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SearchInputRounded } from "@/components/sorts/SearchInputRounded";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { mustGetCosmosNetwork, NetworkKind } from "@/networks";
import { fontSemibold20, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { Proposal, ProposalStatus } from "@/utils/types/gov";

export const GovernanceScreen: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filter, setFilter] = useState<ProposalStatus>();
  const [searchInput, setSearchInput] = useState("");
  const selectedNetworkId = useSelectedNetworkId();

  useEffect(() => {
    const effect = async () => {
      try {
        const network = mustGetCosmosNetwork(selectedNetworkId);
        const res = await fetch(
          `${network.restEndpoint}/cosmos/gov/v1beta1/proposals`,
        );
        const data = await res.json();

        setProposals(data.proposals.reverse());
      } catch (err) {
        console.error(err);
      }
    };
    effect();
  }, [selectedNetworkId]);

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
          flexDirection: "row",
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
          }}
        >
          <SearchInputRounded
            handleChangeSearch={(text) => setSearchInput(text)}
          />
          <PeriodDropdown onChange={setFilter} style={{ zIndex: 100 }} />
          <ProposalsDropdown onChange={() => {}} style={{ zIndex: 100 }} />
        </View>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 24,
          marginRight: -20,
          zIndex: -1,
        }}
      >
        {filteredProposals
          .filter((value) =>
            value.content.title
              .toLowerCase()
              .includes(searchInput.toLowerCase()),
          )
          .map((proposals) => (
            <GovernanceBox proposal={proposals} />
          ))}
      </View>
    </ScreenContainer>
  );
};
