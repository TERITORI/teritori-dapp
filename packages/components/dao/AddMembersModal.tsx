import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { useFeedbacks } from "../../context/FeedbacksProvider";
import { Member } from "../../contracts-clients/cw4-group/Cw4Group.types";
import { useDAOGroup } from "../../hooks/dao/useDAOGroup";
import { useDAOMakeProposal } from "../../hooks/dao/useDAOMakeProposal";
import { useInvalidateDAOProposals } from "../../hooks/dao/useDAOProposals";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkKind, parseUserId } from "../../networks";
import { MembersFields } from "../../screens/Organizations/components/MembersFields";
import { MemberSettingFormType } from "../../screens/Organizations/types";
import { toRawURLBase64String } from "../../utils/buffer";
import { adenaVMCall, extractGnoNumber } from "../../utils/gno";
import { neutral33 } from "../../utils/style/colors";
import { PrimaryButton } from "../buttons/PrimaryButton";
import ModalBase from "../modals/ModalBase";
import { SpacerColumn } from "../spacer";

interface GnoMember {
  groupId: number;
  addr: string;
  weight: number;
  metadata: string;
}

export const AddMembersModal: React.FC<{
  daoId: string;
  show: boolean;
  onClose: () => void;
}> = ({ daoId, show, onClose }) => {
  const [network] = parseUserId(daoId);
  const selectedWallet = useSelectedWallet();
  const proposeToAddMembers = useProposeToAddMembers(daoId);
  const { handleSubmit, control, setValue, watch } =
    useForm<MemberSettingFormType>();
  const members = watch("members");
  const [isSubmitLoading, setSubmitLoading] = useState(false);
  const { setToastError, setToastSuccess } = useFeedbacks();

  const onSubmit = async () => {
    setSubmitLoading(true);
    try {
      await proposeToAddMembers(
        selectedWallet?.address,
        members.map((m) => {
          // We need to make weight as string
          return {
            addr: m.addr,
            weight:
              typeof m.weight === "number" ? m.weight : parseInt(m.weight, 10),
          };
        })
      );
      setToastSuccess({ title: "Proposal submitted", message: "" });
      onClose();
    } catch (e) {
      console.error("Error making a proposal to add members: ", e);
      const message: string = e instanceof Error ? e.message : e.toString();
      setToastError({
        title: "Error making a proposal to add members: ",
        message,
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <ModalBase
      visible={show}
      label="Add members to DAO"
      onClose={onClose}
      noBrokenCorners
      width={800}
    >
      <ScrollView style={{ maxHeight: 600 }}>
        <MembersFields
          networkId={network?.id}
          control={control}
          watch={watch}
          setValue={setValue}
        />
      </ScrollView>

      <SpacerColumn size={2} />
      <View style={{ height: 1, backgroundColor: neutral33 }} />
      <SpacerColumn size={2} />

      <PrimaryButton
        touchableStyle={{ alignSelf: "flex-end" }}
        text="Make a proposal to add these members"
        onPress={handleSubmit(onSubmit)}
        loader={isSubmitLoading}
      />
      <SpacerColumn size={2.5} />
    </ModalBase>
  );
};

const useProposeToAddMembers = (daoId: string) => {
  const makeProposal = useDAOMakeProposal(daoId);
  const { data: groupAddress } = useDAOGroup(daoId);
  const invalidateDAOProposals = useInvalidateDAOProposals(daoId);
  return useCallback(
    async (senderAddress: string | undefined, membersToAdd: Member[]) => {
      const [network, daoAddress] = parseUserId(daoId);
      if (!senderAddress) {
        throw new Error("Invalid sender");
      }
      switch (network?.kind) {
        case NetworkKind.Cosmos: {
          if (!groupAddress) {
            throw new Error("DAO group address not found");
          }
          const updateMembersReq: {
            add: Member[];
            remove: string[];
          } = {
            add: membersToAdd,
            remove: [],
          };
          await makeProposal(senderAddress, {
            title: `Add ${membersToAdd.length} member(s)`, // with weight ${membersToAdd.weight}`,
            description: "",
            msgs: [
              {
                wasm: {
                  execute: {
                    contract_addr: groupAddress,
                    msg: Buffer.from(
                      JSON.stringify({
                        update_members: updateMembersReq,
                      })
                    ).toString("base64"),
                    funds: [],
                  },
                },
              },
            ],
          });
          break;
        }
        case NetworkKind.Gno: {
          const client = new GnoJSONRPCProvider(network.endpoint);

          const groupId = extractGnoNumber(
            await client.evaluateExpression(daoAddress, "GetGroupID()")
          );

          const b64Messages: string[] = [];
          for (const member of membersToAdd) {
            b64Messages.push(
              toRawURLBase64String(
                encodeAddMember({
                  groupId,
                  addr: member.addr,
                  weight: member.weight,
                  metadata: "",
                })
              )
            );
          }
          await adenaVMCall(
            network.id,
            {
              caller: senderAddress,
              send: "",
              pkg_path: daoAddress,
              func: "Propose",
              args: ["0", "Add members", "", b64Messages.join(",")],
            },
            { gasWanted: 2000000 }
          );
          break;
        }
      }
      invalidateDAOProposals();
    },
    [daoId, groupAddress, invalidateDAOProposals, makeProposal]
  );
};

const encodeAddMember = (member: GnoMember) => {
  const b = Buffer.alloc(16000); // TODO: compute size or concat

  let offset = 0;

  const type = "AddMember";
  b.writeUInt16BE(type.length, offset);
  offset += 2;
  b.write(type, offset);
  offset += type.length;

  b.writeUInt32BE(0, offset);
  offset += 4;
  b.writeUInt32BE(member.groupId, offset);
  offset += 4;

  b.writeUInt16BE(member.addr.length, offset);
  offset += 2;
  b.write(member.addr, offset);
  offset += member.addr.length;

  b.writeUInt32BE(member.weight, offset);
  offset += 4;

  b.writeUInt16BE(member.metadata.length, offset);
  offset += 2;
  b.write(member.metadata, offset);
  offset += member.metadata.length;

  return Buffer.from(b.subarray(0, offset));
};
