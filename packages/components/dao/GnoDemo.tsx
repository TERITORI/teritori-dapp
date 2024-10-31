import { useState } from "react";
import { View } from "react-native";

import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useInvalidateDAOProposals } from "../../hooks/dao/useDAOProposals";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkKind, parseUserId } from "../../networks";
import { adenaVMCall } from "../../utils/gno";
import {
  GnoDAOUpdateSettings,
  GnoSingleChoiceProposal,
} from "../../utils/gnodao/messages";
import { modalMarginPadding } from "../../utils/style/modals";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { TextInputCustom } from "../inputs/TextInputCustom";
import ModalBase from "../modals/ModalBase";
import { SpacerColumn } from "../spacer";

import { ConfigureVotingSection } from "@/components/dao/ConfigureVotingSection";

const toFixed4 = (n: number) => {
  return Math.round(n * 100);
};

export const GnoDemo: React.FC<{
  daoId: string;
}> = ({ daoId }) => {
  const [network, daoAddress] = parseUserId(daoId);
  const wallet = useSelectedWallet();
  const { wrapWithFeedback } = useFeedbacks();
  if (network?.kind !== NetworkKind.Gno || !wallet) return null;
  return (
    <View>
      <GnoCreateProposal daoId={daoId} />
      <SpacerColumn size={4} />
      <SpacerColumn size={4} />
      <SpacerColumn size={4} />
      <ConfigureVotingSection
        onSubmit={async (form) =>
          wrapWithFeedback(async () => {
            const msg: GnoDAOUpdateSettings = {
              type: "gno.land/p/teritori/dao_proposal_single.UpdateSettings",
              payload: {
                threshold: {
                  thresholdQuorum: {
                    threshold: {
                      percent: toFixed4(form.supportPercent),
                    },
                    quorum: {
                      percent: toFixed4(form.minimumApprovalPercent),
                    },
                  },
                },
              },
            };
            const propReq: GnoSingleChoiceProposal = {
              title: "Update settings",
              description: "",
              messages: [msg],
            };
            await adenaVMCall(network.id, {
              pkg_path: daoAddress,
              func: "ProposeJSON",
              caller: wallet.address,
              send: "",
              args: ["0", JSON.stringify(propReq)],
            });
          })()
        }
        noDuration
        submitLabel="Propose settings change"
        contentContainerStyle={{ paddingHorizontal: 0 }}
      />
    </View>
  );
};

const GnoCreateProposal: React.FC<{ daoId: string | undefined }> = ({
  daoId,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [network, daoAddress] = parseUserId(daoId);
  const selectedWallet = useSelectedWallet();
  const { wrapWithFeedback } = useFeedbacks();
  const invalidateDAOProposals = useInvalidateDAOProposals(daoId);
  if (network?.kind !== NetworkKind.Gno || !selectedWallet) {
    return null;
  }
  return (
    <>
      <PrimaryButton
        text="Create sentiment proposal"
        onPress={() => {
          setModalVisible(true);
        }}
      />
      <ModalBase
        label={`Create proposal on ${daoAddress}`}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <TextInputCustom
          label="Title"
          name="title"
          onChangeText={setTitle}
          value={title}
        />
        <SpacerColumn size={2} />
        <TextInputCustom
          label="Description"
          name="description"
          onChangeText={setDescription}
          value={description}
          multiline
          numberOfLines={10}
        />
        <SpacerColumn size={2} />
        <PrimaryButton
          text="Propose"
          loader
          boxStyle={{ marginBottom: modalMarginPadding }}
          onPress={wrapWithFeedback(
            async () => {
              const propReq: GnoSingleChoiceProposal = {
                title,
                description,
                messages: [],
              };
              await adenaVMCall(
                network.id,
                {
                  caller: selectedWallet.address,
                  send: "",
                  pkg_path: "gno.land/r/" + selectedWallet,
                  func: "ProposeJSON",
                  args: ["0", JSON.stringify(propReq)],
                },
                { gasWanted: 10000000 },
              );
              setModalVisible(false);
              await invalidateDAOProposals();
            },
            { title: "Success", message: "Proposal created" },
          )}
        />
      </ModalBase>
    </>
  );
};
