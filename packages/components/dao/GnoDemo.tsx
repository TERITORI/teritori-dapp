import { Decimal } from "@cosmjs/math";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { View } from "react-native";

import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useInvalidateDAOProposals } from "../../hooks/dao/useDAOProposals";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkKind, parseUserId } from "../../networks";
import { ConfigureVotingSection } from "../../screens/Organizations/components/ConfigureVotingSection";
import { toRawURLBase64String } from "../../utils/buffer";
import { adenaVMCall, extractGnoNumber } from "../../utils/gno";
import { fontSemibold20 } from "../../utils/style/fonts";
import { modalMarginPadding } from "../../utils/style/modals";
import { BrandText } from "../BrandText";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { TextInputCustom } from "../inputs/TextInputCustom";
import ModalBase from "../modals/ModalBase";
import { SpacerColumn } from "../spacer";

export const GnoDemo: React.FC<{
  daoId: string;
}> = ({ daoId }) => {
  const [network, daoAddress] = parseUserId(daoId);
  const { selectedWallet } = useSelectedWallet();
  const { wrapWithFeedback } = useFeedbacks();
  if (network?.kind !== NetworkKind.Gno || !selectedWallet) return null;
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
            const msg = toRawURLBase64String(
              encodeUpdateSettings(
                form.supportPercent,
                form.minimumApprovalPercent
              )
            );
            await adenaVMCall(network.id, {
              pkg_path: daoAddress,
              func: "Propose",
              caller: selectedWallet.address,
              send: "",
              args: ["0", "Update settings", "", msg],
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
  const { selectedWallet } = useSelectedWallet();
  const { wrapWithFeedback } = useFeedbacks();
  const addressParts = daoAddress.split("/");
  const [name, setName] = useState(
    addressParts.length > 0 ? addressParts[addressParts.length - 1] : ""
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
        `GetBoardIDFromName("${name}")`
      );
      const boardIdNum = extractGnoNumber(boardIdRes);
      if (!boardIdNum) {
        throw new Error(`invalid board id ${boardIdNum}`);
      }
      return extractGnoNumber(
        await client.evaluateExpression(
          network.modboardsPkgPath,
          `getBoard(${boardIdNum}).flags.GetFlagCount(getFlagID(${threadId}, ${postId}))`
        )
      );
    }
  );

  if (network?.kind !== NetworkKind.Gno || !selectedWallet) return null;
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
            `GetBoardIDFromName("${name}")`
          );
          console.log(boardIdRes);
          const boardIdNum = extractGnoNumber(boardIdRes);
          if (!boardIdNum) {
            throw new Error(`invalid board id ${boardIdNum}`);
          }
          const threadIdNum = parseInt(threadId, 10);
          const postIdNum = parseInt(postId, 10);
          const msg = toRawURLBase64String(
            encodeDeletePost(boardIdNum, threadIdNum, postIdNum, reason)
          );
          await adenaVMCall(
            network.id,
            {
              pkg_path: daoAddress,
              func: "Propose",
              caller: selectedWallet.address,
              send: "",
              args: [
                "0",
                threadIdNum === postIdNum ? "Delete thread" : "Delete post",
                "",
                msg,
              ],
            },
            { gasWanted: 10000000 }
          );
        })}
      />
    </View>
  );
};

const CreateBoard: React.FC<{ daoId: string }> = ({ daoId }) => {
  const [network, daoAddress] = parseUserId(daoId);
  const { selectedWallet } = useSelectedWallet();
  const { wrapWithFeedback } = useFeedbacks();
  const [name, setName] = useState("");

  if (network?.kind !== NetworkKind.Gno || !selectedWallet) return null;
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
          const msg = toRawURLBase64String(encodeCreateBoard(name));
          await adenaVMCall(
            network.id,
            {
              pkg_path: daoAddress,
              func: "Propose",
              caller: selectedWallet.address,
              send: "",
              args: ["0", "Create moderated board", "", msg],
            },
            { gasWanted: 10000000 }
          );
        })}
      />
    </View>
  );
};

const MintTori: React.FC<{ daoId: string }> = ({ daoId }) => {
  const [network, daoAddress] = parseUserId(daoId);
  const { selectedWallet: wallet } = useSelectedWallet();
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
          const msg = toRawURLBase64String(encodeMintTori(amount, recipient));
          await adenaVMCall(network.id, {
            pkg_path: daoAddress,
            func: "Propose",
            caller: wallet.address,
            send: "",
            args: ["0", `Mint ${amount} Tori to ${recipient}`, "", msg],
          });
        })}
      />
    </View>
  );
};

export const GnoCreateProposal: React.FC<{ daoId: string | undefined }> = ({
  daoId,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [network, daoAddress] = parseUserId(daoId);
  const { selectedWallet } = useSelectedWallet();
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
        noBrokenCorners
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
          style={{ marginBottom: modalMarginPadding }}
          onPress={wrapWithFeedback(
            async () => {
              await adenaVMCall(network.id, {
                caller: selectedWallet.address,
                send: "",
                pkg_path: daoAddress,
                func: "Propose",
                args: ["0", title, description, ""],
              });
              setModalVisible(false);
              await invalidateDAOProposals();
            },
            { title: "Success", message: "Proposal created" }
          )}
        />
      </ModalBase>
    </>
  );
};

const encodeCreateBoard = (name: string) => {
  const b = Buffer.alloc(16000); // TODO: compute size or concat
  let offset = 0;

  const t = "CreateBoard";
  b.writeUInt16BE(t.length, offset);
  offset += 2;
  b.write(t, offset);
  offset += t.length;

  b.writeUInt16BE(name.length, offset);
  offset += 2;
  b.write(name, offset);
  offset += name.length;

  return Buffer.from(b.subarray(0, offset));
};

const encodeDeletePost = (
  boardId: number,
  threadId: number,
  postId: number,
  reason: string
) => {
  const b = Buffer.alloc(16000); // TODO: compute size or concat
  let offset = 0;

  const t = "DeletePost";
  b.writeUInt16BE(t.length, offset);
  offset += 2;
  b.write(t, offset);
  offset += t.length;

  b.writeUInt32BE(0, offset);
  offset += 4;
  b.writeUInt32BE(boardId, offset);
  offset += 4;

  b.writeUInt32BE(0, offset);
  offset += 4;
  b.writeUInt32BE(threadId, offset);
  offset += 4;

  b.writeUInt32BE(0, offset);
  offset += 4;
  b.writeUInt32BE(postId, offset);
  offset += 4;

  b.writeUInt16BE(reason.length, offset);
  offset += 2;
  b.write(reason, offset);
  offset += reason.length;

  return Buffer.from(b.subarray(0, offset));
};

const encodeUpdateSettings = (threshold: number, quorum: number) => {
  const b = Buffer.alloc(16000); // TODO: compute size or concat
  let offset = 0;

  const t = "UpdateSettings";
  b.writeUInt16BE(t.length, offset);
  offset += 2;
  b.write(t, offset);
  offset += t.length;

  b.writeUInt8(1, offset);
  offset += 1;

  b.writeUInt16BE(threshold * 100, offset);
  offset += 2;

  b.writeUInt16BE(quorum * 100, offset);
  offset += 2;

  return Buffer.from(b.subarray(0, offset));
};

const encodeMintTori = (amount: string, recipient: string) => {
  const b = Buffer.alloc(16000); // TODO: compute size or concat
  let offset = 0;

  const t = "MintTori";
  b.writeUInt16BE(t.length, offset);
  offset += 2;
  b.write(t, offset);
  offset += t.length;

  b.writeUInt16BE(recipient.length, offset);
  offset += 2;
  b.write(recipient, offset);
  offset += recipient.length;

  const amountDec = Decimal.fromUserInput(amount, 6);
  const amountNumber = parseInt(amountDec.atomics, 10);
  b.writeUInt32BE(0, offset);
  offset += 4;
  b.writeUInt32BE(amountNumber, offset);
  offset += 4;

  return Buffer.from(b.subarray(0, offset));
};
