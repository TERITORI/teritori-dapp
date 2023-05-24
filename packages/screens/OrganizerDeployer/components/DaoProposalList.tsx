import React, { useState, useEffect } from "react";
import { StyleSheet, View, Pressable } from "react-native";

import { DaoCreateProposalModal } from "./DaoCreateProposalModal";
import { DaoProposalModal } from "./DaoProposalModal";
import { BrandText } from "../../../components/BrandText";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { DaoCoreQueryClient } from "../../../contracts-clients/dao-core/DaoCore.client";
import { DaoProposalSingleQueryClient } from "../../../contracts-clients/dao-proposal-single/DaoProposalSingle.client";
import { ProposalResponse } from "../../../contracts-clients/dao-proposal-single/DaoProposalSingle.types";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { mustGetNonSigningCosmWasmClient } from "../../../networks";
import { neutral33, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../utils/style/fonts";

export const DaoProposalList: React.FC<{
  daoAddress: string;
}> = ({ daoAddress }) => {
  const selectedWallet = useSelectedWallet();
  const [displayCreateProposalModal, setDisplayCreateProposalModal] =
    useState<boolean>(false);
  const [displayProposalModal, setDisplayProposalModal] =
    useState<boolean>(false);
  const [selectedProposal, setSelectedProposal] =
    useState<ProposalResponse | null>(null);
  const [proposalList, setProposalList] = useState<ProposalResponse[]>([]);

  useEffect(() => {
    const getProposalList = async () => {
      if (!selectedWallet || !daoAddress) return;
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(
        selectedWallet.networkId
      );
      const coreClient = new DaoCoreQueryClient(cosmwasmClient, daoAddress);
      const proposalModuleAddress = (await coreClient.proposalModules({}))[0]
        .address;
      const daoProposalClient = new DaoProposalSingleQueryClient(
        cosmwasmClient,
        proposalModuleAddress
      );
      const listProposals = await daoProposalClient.listProposals({});
      setProposalList(listProposals.proposals);
    };
    getProposalList();
  }, [daoAddress, selectedWallet]);

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
          daoAddress={daoAddress}
        />
      )}
      {displayProposalModal && selectedProposal && (
        <DaoProposalModal
          visible={displayProposalModal}
          onClose={() => setDisplayProposalModal(false)}
          proposalInfo={selectedProposal}
          daoAddress={daoAddress}
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
          {[...proposalList].reverse().map((proposal, index) => (
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
