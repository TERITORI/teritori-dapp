import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { View } from "react-native";

import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useInvalidateDAOProposals } from "../../hooks/dao/useDAOProposals";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkKind, parseUserId } from "../../networks";
import { ConfigureVotingSection } from "../../screens/Organizations/components/ConfigureVotingSection";
import { adenaVMCall, extractGnoNumber } from "../../utils/gno";
import {
  GnoDAOUpdateSettings,
  GnoSingleChoiceProposal,
  GnoModboardsDeletePostMessage,
  GnoModboardsCreateMessage,
  GnoMintToriMessage,
} from "../../utils/gnodao/messages";
import { fontSemibold20 } from "../../utils/style/fonts";
import { modalMarginPadding } from "../../utils/style/modals";
import { BrandText } from "../BrandText";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { TextInputCustom } from "../inputs/TextInputCustom";
import ModalBase from "../modals/ModalBase";
import { SpacerColumn } from "../spacer";

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
      <CreateBoard daoId={daoId} />
      <SpacerColumn size={4} />
      <DeletePost daoId={daoId} />
      <SpacerColumn size={4} />
      <MintTori daoId={daoId} />
      <ConfigureVotingSection
        onSubmit={async (form) =>
          wrapWithFeedback(async () => {
            const msg: GnoDAOUpdateSettings = {
              type: "gno.land/p/demo/teritori/dao_proposal_single.UpdateSettings",
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

const DeletePost: React.FC<{ daoId: string }> = ({ daoId }) => {
  const [network, daoAddress] = parseUserId(daoId);
  const wallet = useSelectedWallet();
  const { wrapWithFeedback } = useFeedbacks();
  const addressParts = daoAddress.split("/");
  const [name, setName] = useState(
    addressParts.length > 0 ? addressParts[addressParts.length - 1] : "",
  );
  const [threadId, setThreadId] = useState("1");
  const [postId, setPostId] = useState("1");
  const [reason, setReason] = useState("Moderated");

  const { data: flagCount } = useQuery(
    ["flagCount", name, threadId, postId],
    async () => {
      if (network?.kind !== NetworkKind.Gno || !network.modboardsPkgPath) {
        return 0;
      }
      const client = new GnoJSONRPCProvider(network.endpoint);
      const boardIdRes = await client.evaluateExpression(
        network.modboardsPkgPath,
        `GetBoardIDFromName("${name}")`,
      );
      const boardIdNum = extractGnoNumber(boardIdRes);
      if (!boardIdNum) {
        throw new Error(`invalid board id ${boardIdNum}`);
      }
      return extractGnoNumber(
        await client.evaluateExpression(
          network.modboardsPkgPath,
          `getBoard(${boardIdNum}).flags.GetFlagCount(getFlagID(${threadId}, ${postId}))`,
        ),
      );
    },
  );

  if (network?.kind !== NetworkKind.Gno || !wallet) return null;
  return (
    <View>
      <BrandText style={fontSemibold20}>Delete a post</BrandText>
      <SpacerColumn size={2} />
      <TextInputCustom
        label="Board name"
        name="boardName"
        placeholder="Board name"
        onChangeText={setName}
        value={name}
      />
      <SpacerColumn size={2} />
      <TextInputCustom
        label="Thread ID"
        name="threadId"
        placeholder="Thread ID"
        onChangeText={setThreadId}
        value={threadId}
      />
      <SpacerColumn size={2} />
      <TextInputCustom
        label="Post ID"
        name="postId"
        placeholder="Post ID"
        onChangeText={setPostId}
        value={postId}
      />
      <SpacerColumn size={2} />
      <TextInputCustom
        label="Reason"
        name="reason"
        placeholder="Reason"
        onChangeText={setReason}
        value={reason}
      />
      <SpacerColumn size={2} />
      <BrandText>Flagged: {flagCount || 0} time(s)</BrandText>
      <SpacerColumn size={2} />
      <PrimaryButton
        text="Propose delete"
        loader
        onPress={wrapWithFeedback(async () => {
          if (network?.kind !== NetworkKind.Gno || !network.modboardsPkgPath) {
            throw new Error("invalid network");
          }
          const client = new GnoJSONRPCProvider(network.endpoint);
          const boardIdRes = await client.evaluateExpression(
            network.modboardsPkgPath,
            `GetBoardIDFromName("${name}")`,
          );
          console.log(boardIdRes);
          const boardIdNum = extractGnoNumber(boardIdRes);
          if (!boardIdNum) {
            throw new Error(`invalid board id ${boardIdNum}`);
          }
          const threadIdNum = parseInt(threadId, 10);
          const postIdNum = parseInt(postId, 10);
          const payload: GnoModboardsDeletePostMessage = {
            type: "gno.land/r/demo/teritori/modboards.DeletePost",
            payload: {
              boardId: boardIdNum,
              threadId: threadIdNum,
              postId: postIdNum,
              reason,
            },
          };
          const propReq: GnoSingleChoiceProposal = {
            title: threadIdNum === postIdNum ? "Delete thread" : "Delete post",
            description: "",
            messages: [payload],
          };
          await adenaVMCall(
            network.id,
            {
              pkg_path: daoAddress,
              func: "ProposeJSON",
              caller: wallet.address,
              send: "",
              args: ["0", JSON.stringify(propReq)],
            },
            { gasWanted: 10000000 },
          );
        })}
      />
    </View>
  );
};

const CreateBoard: React.FC<{ daoId: string }> = ({ daoId }) => {
  const [network, daoAddress] = parseUserId(daoId);
  const wallet = useSelectedWallet();
  const { wrapWithFeedback } = useFeedbacks();
  const [name, setName] = useState("");

  if (network?.kind !== NetworkKind.Gno || !wallet) return null;
  return (
    <View>
      <BrandText style={fontSemibold20}>Create a board</BrandText>
      <SpacerColumn size={2} />
      <TextInputCustom
        label="Board name"
        name="boardName"
        placeholder="Board name"
        onChangeText={setName}
        value={name}
      />
      <SpacerColumn size={2} />
      <PrimaryButton
        text="Propose creation"
        loader
        onPress={wrapWithFeedback(async () => {
          const payload: GnoModboardsCreateMessage = {
            type: "gno.land/r/demo/teritori/modboards.CreateBoard",
            payload: {
              name,
            },
          };
          const propReq: GnoSingleChoiceProposal = {
            title: `Create board ${name}`,
            description: "",
            messages: [payload],
          };
          await adenaVMCall(
            network.id,
            {
              pkg_path: daoAddress,
              func: "ProposeJSON",
              caller: wallet.address,
              send: "",
              args: ["0", JSON.stringify(propReq)],
            },
            { gasWanted: 10000000 },
          );
        })}
      />
    </View>
  );
};

const MintTori: React.FC<{ daoId: string }> = ({ daoId }) => {
  const [network, daoAddress] = parseUserId(daoId);
  const wallet = useSelectedWallet();
  const { wrapWithFeedback } = useFeedbacks();
  const [amount, setAmount] = useState("1");
  const [recipient, setRecipient] = useState("");

  if (network?.kind !== NetworkKind.Gno || !wallet) return null;
  return (
    <View>
      <BrandText style={fontSemibold20}>Mint Tori</BrandText>
      <SpacerColumn size={2} />
      <TextInputCustom
        label="Amount"
        name="amount"
        placeholder="Amount"
        onChangeText={setAmount}
        value={amount}
      />
      <SpacerColumn size={2} />
      <TextInputCustom
        label="Recipient"
        name="recipient"
        placeholder="Recipient"
        onChangeText={setRecipient}
        value={recipient}
      />
      <SpacerColumn size={2} />
      <PrimaryButton
        text="Propose mint"
        loader
        onPress={wrapWithFeedback(async () => {
          const payload: GnoMintToriMessage = {
            type: "gno.land/r/demo/teritori/tori.Mint",
            payload: {
              amount: parseInt(amount, 10),
              address: recipient,
            },
          };
          const msg: GnoSingleChoiceProposal = {
            title: `Mint ${amount} utori to ${recipient}`,
            description: "",
            messages: [payload],
          };
          await adenaVMCall(network.id, {
            pkg_path: daoAddress,
            func: "ProposeJSON",
            caller: wallet.address,
            send: "",
            args: ["0", JSON.stringify(msg)],
          });
        })}
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
                  pkg_path: daoAddress,
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
