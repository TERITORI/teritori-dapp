import { Picker } from "@react-native-picker/picker";
import React, { FC, useState } from "react";

import { useProject } from "../hooks/useProjects";

import { BrandText } from "@/components/BrandText";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import ModalBase from "@/components/modals/ModalBase";
import { SpacerColumn } from "@/components/spacer";
import { UsernameWithAvatar } from "@/components/user/UsernameWithAvatar";
import {
  NetworkFeature,
  getNetworkFeature,
  getUserId,
  parseUserId,
} from "@/networks";
import { adenaVMCall } from "@/utils/gno";

export const ResolveConflictButton: FC<{
  userId: string | undefined;
  projectId: number | undefined;
}> = ({ projectId, userId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <PrimaryButton
        text="Resolve conflict"
        loader
        onPress={() => setModalVisible(true)}
        size="SM"
        width={280}
      />
      {modalVisible && (
        <ResolveConflictModal
          userId={userId}
          projectId={projectId}
          onClose={() => setModalVisible(false)}
        />
      )}
    </>
  );
};

type UserRole = "initiator" | "responder" | "resolver" | "observer";

const ResolveConflictModal: FC<{
  userId: string | undefined;
  projectId: number | undefined;
  onClose: () => void;
}> = ({ userId, projectId, onClose }) => {
  const [network, userAddress] = parseUserId(userId);
  const [outcome, setOutcome] = useState<number>(1);
  const [resolutionMessage, setResolutionMessage] = useState<string>("");
  const { data: project } = useProject(network?.id, projectId?.toString());
  const conflicts = project?.conflicts;
  const lastConflict = conflicts?.length
    ? conflicts[conflicts.length - 1]
    : null;

  let responderAddress;
  if (lastConflict?.initiator === project?.contractor) {
    responderAddress = project?.funder;
  } else {
    responderAddress = project?.contractor;
  }

  let userRole: UserRole;
  if (lastConflict?.initiator === userAddress) {
    userRole = "initiator";
  } else if (responderAddress === userAddress) {
    userRole = "responder";
  } else if (project?.conflictHandler === userAddress) {
    userRole = "resolver";
  } else {
    userRole = "observer";
  }

  return (
    <ModalBase visible onClose={onClose}>
      <SpacerColumn size={2} />
      <UsernameWithAvatar
        userId={getUserId(network?.id, lastConflict?.initiator)}
      />
      <SpacerColumn size={1} />
      <PrimaryBox>
        <BrandText>{lastConflict?.initiatorMessage}</BrandText>
      </PrimaryBox>

      {typeof lastConflict?.responseMessage === "string" && (
        <>
          <SpacerColumn size={2} />
          <UsernameWithAvatar
            userId={getUserId(network?.id, responderAddress)}
          />
          <SpacerColumn size={1} />
          <PrimaryBox>
            <BrandText>{lastConflict.responseMessage}</BrandText>
          </PrimaryBox>
        </>
      )}
      {userRole === "responder" && !lastConflict?.respondedAt && (
        <>
          <SpacerColumn size={2} />
          <PrimaryButton
            text="Respond"
            loader
            onPress={async () => {
              if (typeof projectId !== "number") {
                throw new Error("Invalid project id");
              }
              if (!network || !userAddress) {
                throw new Error("Invalid user id");
              }
              const pmFeature = getNetworkFeature(
                network.id,
                NetworkFeature.GnoProjectManager,
              );
              if (!pmFeature) {
                throw new Error(
                  "Project Manager is not supported on this network",
                );
              }
              await adenaVMCall(network.id, {
                send: "",
                caller: userAddress,
                pkg_path: pmFeature.projectsManagerPkgPath,
                func: "RespondToConflict",
                args: [projectId.toString(), "Says who"],
              });
            }}
          />
        </>
      )}

      {typeof lastConflict?.resolutionMessage === "string" && (
        <>
          <SpacerColumn size={2} />
          <UsernameWithAvatar
            userId={getUserId(network?.id, project?.conflictHandler)}
          />
          <SpacerColumn size={1} />
          <PrimaryBox>
            <BrandText>{lastConflict.resolutionMessage}</BrandText>
          </PrimaryBox>
        </>
      )}
      {userRole === "resolver" && !lastConflict?.resolvedAt && (
        <>
          <SpacerColumn size={2} />
          <TextInputCustom
            label="Message"
            name="resolutionMessage"
            multiline
            value={resolutionMessage}
            onChangeText={setResolutionMessage}
          />
          <OutcomeSelect value={outcome} onChange={setOutcome} />
          <PrimaryButton
            text="Resolve conflict"
            loader
            onPress={async () => {
              if (typeof projectId !== "number") {
                throw new Error("Invalid project id");
              }
              if (!network || !userAddress) {
                throw new Error("Invalid user id");
              }
              const pmFeature = getNetworkFeature(
                network.id,
                NetworkFeature.GnoProjectManager,
              );
              if (!pmFeature) {
                throw new Error(
                  "Project Manager is not supported on this network",
                );
              }
              await adenaVMCall(network.id, {
                send: "",
                caller: userAddress,
                pkg_path: pmFeature.projectsManagerPkgPath,
                func: "ResolveConflict",
                args: [
                  projectId.toString(),
                  outcome.toString(),
                  "so childish omg",
                ],
              });
            }}
          />
        </>
      )}
    </ModalBase>
  );
};

// react-native/expo-sdk select
const OutcomeSelect: FC<{
  value: number;
  onChange: (value: number) => void;
}> = ({ value, onChange }) => {
  return (
    <Picker<number> selectedValue={value} onValueChange={onChange}>
      <Picker.Item label="Resume contract" value={1} />
      <Picker.Item label="Refund funder" value={2} />
      <Picker.Item label="Pay contractor" value={3} />
    </Picker>
  );
};
