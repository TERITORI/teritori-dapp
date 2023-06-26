import { View } from "react-native";

import { useFeedbacks } from "../../context/FeedbacksProvider";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkKind, parseUserId } from "../../networks";
import { ConfigureVotingSection } from "../../screens/Organizations/components/ConfigureVotingSection";
import { adenaVMCall } from "../../utils/gno";
import { fontSemibold20 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { PrimaryButton } from "../buttons/PrimaryButton";

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
      <ConfigureVotingSection
        onSubmit={async (form) =>
          wrapWithFeedback(async () => {
            const msg = encodeUpdateSettings(
              form.supportPercent,
              form.minimumApprovalPercent
            )
              .toString("base64")
              .replaceAll("=", "")
              .replaceAll("+", "-")
              .replaceAll("/", "_");
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
        submitLabel="Propose"
      />
    </View>
  );
};

const CreateBoard: React.FC<{ daoId: string }> = ({ daoId }) => {
  const [network, daoAddress] = parseUserId(daoId);
  const wallet = useSelectedWallet();
  const { wrapWithFeedback } = useFeedbacks();
  if (network?.kind !== NetworkKind.Gno || !wallet) return null;
  return (
    <View>
      <BrandText style={fontSemibold20}>Create a board</BrandText>
      <PrimaryButton
        text="Create"
        loader
        onPress={wrapWithFeedback(async () => {
          const msg = encodeCreateBoard("test_board")
            .toString("base64")
            .replaceAll("=", "")
            .replaceAll("+", "-")
            .replaceAll("/", "_");
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
