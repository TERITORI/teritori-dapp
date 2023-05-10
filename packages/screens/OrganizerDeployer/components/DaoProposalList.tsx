import React, { useState, useEffect } from "react";
import { StyleSheet, View, Pressable } from "react-native";

import { DaoCreateProposalModal } from "./DaoCreateProposalModal";
import { DaoProposalModal } from "./DaoProposalModal";
import { BrandText } from "../../../components/BrandText";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { TeritoriDaoProposalQueryClient } from "../../../contracts-clients/teritori-dao/TeritoriDaoProposal.client";
import { ProposalInfo } from "../../../contracts-clients/teritori-dao/TeritoriDaoProposal.types";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { mustGetNonSigningCosmWasmClient } from "../../../networks";
import { neutral33, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../utils/style/fonts";
import { DaoInfo } from "../types";

export const DaoProposalList: React.FC<{
  daoInfo: DaoInfo;
}> = ({ daoInfo }) => {
  const selectedWallet = useSelectedWallet();
  const [displayCreateProposalModal, setDisplayCreateProposalModal] =
    useState<boolean>(false);
  const [displayProposalModal, setDisplayProposalModal] =
    useState<boolean>(false);
  const [selectedProposal, setSelectedProposal] = useState<ProposalInfo | null>(
    null
  );
  const [proposalList, setProposalList] = useState<ProposalInfo[]>([]);

  useEffect(() => {
    const getProposalList = async () => {
      if (!selectedWallet || !daoInfo || !daoInfo.proposalModuleAddress) return;
      const proposalModuleAddress = daoInfo.proposalModuleAddress;
      const networkId = selectedWallet?.networkId;
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const daoProposalClient = new TeritoriDaoProposalQueryClient(
        cosmwasmClient,
        proposalModuleAddress
      );
      const listProposals = await daoProposalClient.listProposals();
      setProposalList(listProposals.proposals);
    };
    getProposalList();
  }, [daoInfo, selectedWallet]);

  const onCreateProposal = async () => {
    setDisplayCreateProposalModal(true);
  };
  const showProposal = () => {
    setDisplayProposalModal(true);
  };

  return (
    <View style={styles.container}>
      {displayCreateProposalModal && (
        <DaoCreateProposalModal
          visible={displayCreateProposalModal}
          onClose={() => setDisplayCreateProposalModal(false)}
          daoInfo={daoInfo}
        />
      )}
      {displayProposalModal && selectedProposal && (
        <DaoProposalModal
          visible={displayProposalModal}
          onClose={() => setDisplayProposalModal(false)}
          proposalInfo={selectedProposal}
          daoInfo={daoInfo}
        />
      )}

      <View style={styles.row}>
        <BrandText style={styles.titleStyle}>Create a proposal</BrandText>
        <PrimaryButton
          size="M"
          text="New proposal"
          onPress={() => {
            onCreateProposal();
          }}
        />
      </View>
      <View style={styles.proposals}>
        <View style={{ flexDirection: "row" }}>
          <BrandText style={styles.titleStyle}>Proposals</BrandText>
        </View>
        <View style={{ flexDirection: "column" }}>
          {proposalList.map((proposal, index) => (
            <Pressable
              key={`proposal-${index}`}
              onPress={() => {
                setSelectedProposal(proposal);
                showProposal();
              }}
            >
              <View
                key={index}
                style={{ flexDirection: "row", paddingVertical: 10 }}
              >
                <View style={{ flexShrink: 0, width: "5rem" }}>
                  <BrandText style={styles.textStyle}>{proposal.id}</BrandText>
                </View>
                <View style={{ flexShrink: 0, width: "5rem" }}>
                  <BrandText style={styles.textStyle}>
                    {proposal.proposal.status}
                  </BrandText>
                </View>
                <View style={{ flexGrow: 1 }}>
                  <BrandText style={styles.textStyle}>
                    {proposal.proposal.title}
                  </BrandText>
                </View>
                <View style={{ flexShrink: 0 }}>
                  <BrandText style={styles.textStyle}>
                    {proposal.proposal.start_height}
                  </BrandText>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flexDirection: "column",
    borderTopWidth: 1,
    borderColor: neutral33,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  proposals: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: neutral33,
    flexDirection: "column",
    marginTop: 10,
  },
  titleStyle: StyleSheet.flatten([
    fontSemibold14,
    {
      color: secondaryColor,
    },
  ]),
  textStyle: StyleSheet.flatten([
    fontSemibold13,
    {
      color: secondaryColor,
    },
  ]),
});
