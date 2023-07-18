import { Decimal } from "@cosmjs/math";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { TextInput, View } from "react-native";

import { useFeedbacks } from "../../context/FeedbacksProvider";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkKind, parseUserId } from "../../networks";
import { ConfigureVotingSection } from "../../screens/Organizations/components/ConfigureVotingSection";
import { toRawURLBase64String } from "../../utils/buffer";
import { adenaVMCall, extractGnoNumber } from "../../utils/gno";
import { fontSemibold20 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SpacerColumn } from "../spacer";

const defaultBoard = "dao_realm";

export const DAOSettings: React.FC<{
  daoId: string;
}> = ({ daoId }) => {
  const [network, daoAddress] = parseUserId(daoId);
  const wallet = useSelectedWallet();
  const { wrapWithFeedback } = useFeedbacks();
  if (network?.kind !== NetworkKind.Gno || !wallet) return null;
  return (
    <View>
      <CreateBoard daoId={daoId} />
      <SpacerColumn size={4} />
      <DeletePost daoId={daoId} />
      <SpacerColumn size={4} />
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
            await adenaVMCall({
              pkg_path: daoAddress,
              func: "Propose",
              caller: wallet.address,
              send: "",
              args: ["0", "Update settings", "", msg],
            });
          })()
        }
        noDuration
        submitLabel="Propose settings change"
      />
    </View>
  );
};

const DeletePost: React.FC<{ daoId: string }> = ({ daoId }) => {
  const [network, daoAddress] = parseUserId(daoId);
  const wallet = useSelectedWallet();
  const { wrapWithFeedback } = useFeedbacks();
  const [name, setName] = useState(defaultBoard);
  const [threadId, setThreadId] = useState("1");
  const [postId, setPostId] = useState("1");
  const [reason, setReason] = useState("Moderated");

  const { data: flagCount } = useQuery(
    ["flagCount", name, threadId, postId],
    async () => {
      if (network?.kind !== NetworkKind.Gno) {
        return 0;
      }
      const client = new GnoJSONRPCProvider(network.endpoint);
      const boardIdRes = await client.evaluateExpression(
        "gno.land/r/demo/modboards",
        `GetBoardIDFromName("${name}")`
      );
      const boardIdNum = extractGnoNumber(boardIdRes);
      if (!boardIdNum) {
        throw new Error(`invalid board id ${boardIdNum}`);
      }
      return extractGnoNumber(
        await client.evaluateExpression(
          "gno.land/r/demo/modboards",
          `getBoard(${boardIdNum}).flags.GetFlagCount(getFlagID(${threadId}, ${postId}))`
        )
      );
    }
  );

  if (network?.kind !== NetworkKind.Gno || !wallet) return null;
  return (
    <View>
      <BrandText style={fontSemibold20}>Delete a post</BrandText>
      <SpacerColumn size={2} />
      <TextInput
        placeholder="Board name"
        onChangeText={setName}
        value={name}
        style={{ backgroundColor: "white" }}
      />
      <TextInput
        placeholder="Thread ID"
        onChangeText={setThreadId}
        value={threadId}
        style={{ backgroundColor: "white" }}
      />
      <TextInput
        placeholder="Post ID"
        onChangeText={setPostId}
        value={postId}
        style={{ backgroundColor: "white" }}
      />
      <TextInput
        placeholder="Reason"
        onChangeText={setReason}
        value={reason}
        style={{ backgroundColor: "white" }}
      />
      <BrandText>Flagged: {flagCount || 0} time(s)</BrandText>
      <SpacerColumn size={2} />
      <PrimaryButton
        text="Propose delete"
        loader
        onPress={wrapWithFeedback(async () => {
          if (network?.kind !== NetworkKind.Gno) {
            throw new Error("invalid network");
          }
          const client = new GnoJSONRPCProvider(network.endpoint);
          const boardIdRes = await client.evaluateExpression(
            "gno.land/r/demo/modboards",
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
          await adenaVMCall({
            pkg_path: daoAddress,
            func: "Propose",
            caller: wallet.address,
            send: "",
            args: [
              "0",
              threadIdNum === postIdNum ? "Delete thread" : "Delete post",
              "",
              msg,
            ],
          });
        })}
      />
    </View>
  );
};

const CreateBoard: React.FC<{ daoId: string }> = ({ daoId }) => {
  const [network, daoAddress] = parseUserId(daoId);
  const wallet = useSelectedWallet();
  const { wrapWithFeedback } = useFeedbacks();
  const [name, setName] = useState(defaultBoard);

  if (network?.kind !== NetworkKind.Gno || !wallet) return null;
  return (
    <View>
      <BrandText style={fontSemibold20}>Create a board</BrandText>
      <SpacerColumn size={2} />
      <TextInput
        placeholder="Board name"
        onChangeText={setName}
        value={name}
        style={{ backgroundColor: "white" }}
      />
      <SpacerColumn size={2} />
      <PrimaryButton
        text="Propose creation"
        loader
        onPress={wrapWithFeedback(async () => {
          const msg = toRawURLBase64String(encodeCreateBoard(name));
          await adenaVMCall({
            pkg_path: daoAddress,
            func: "Propose",
            caller: wallet.address,
            send: "",
            args: ["0", "Create moderated board", "", msg],
          });
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
      <TextInput
        placeholder="Amount"
        onChangeText={setAmount}
        value={amount}
        style={{ backgroundColor: "white" }}
      />
      <SpacerColumn size={2} />
      <TextInput
        placeholder="Recipient"
        onChangeText={setRecipient}
        value={recipient}
        style={{ backgroundColor: "white" }}
      />
      <SpacerColumn size={2} />
      <PrimaryButton
        text="Propose mint"
        loader
        onPress={wrapWithFeedback(async () => {
          const msg = toRawURLBase64String(encodeMintTori(amount, recipient));
          await adenaVMCall({
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
