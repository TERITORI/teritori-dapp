import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import React, { FC, useState } from "react";
import { View } from "react-native";

import { useProject } from "./hooks/useProjects";
import { ConflictOutcome, ContractStatus } from "./types";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { PrimaryButtonOutline } from "@/components/buttons/PrimaryButtonOutline";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import { SpacerColumn } from "@/components/spacer";
import { UsernameWithAvatar } from "@/components/user/UsernameWithAvatar";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import {
  NetworkFeature,
  getNetworkFeature,
  getUserId,
  parseUserId,
} from "@/networks";
import { adenaVMCall } from "@/utils/gno";
import { ScreenFC } from "@/utils/navigation";
import {
  errorColor,
  neutral17,
  neutralFF,
  redDefault,
  yellowDefault,
} from "@/utils/style/colors";
import { fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const ProjectsConflictSolvingScreen: ScreenFC<
  "ProjectsConflictSolving"
> = ({ route }) => {
  const projectId = route.params.projectId;
  const networkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const userId = selectedWallet?.userId;
  const userAddress = selectedWallet?.address;
  const { data: project } = useProject(networkId, projectId);
  const userIsParty =
    !!project &&
    !!userAddress &&
    (userAddress === project?.contractor || userAddress === project?.funder);
  return (
    <ScreenContainer isLarge>
      <SpacerColumn size={4} />
      {project?.status === ContractStatus.ACCEPTED && userIsParty && (
        <NewConflictSection projectId={projectId} userId={userId} />
      )}
      {project?.status === ContractStatus.CONFLICT && (
        <OngoingConflictSection
          userId={selectedWallet?.userId}
          projectId={projectId}
        />
      )}
      {(project?.conflicts.length || 0) > 0 &&
        !(
          project?.conflicts.length === 1 &&
          project.status === ContractStatus.CONFLICT
        ) && (
          <SettledConflictsSection
            networkId={networkId}
            projectId={projectId}
          />
        )}
    </ScreenContainer>
  );
};

const NewConflictSection: FC<{
  projectId: string | undefined;
  userId: string | undefined;
}> = ({ projectId, userId }) => {
  const [initialMessage, setInitialMessage] = useState("");
  return (
    <>
      <BrandText style={[fontSemibold28, { marginBottom: layout.spacing_x3 }]}>
        New conflict
      </BrandText>
      <TertiaryBox
        style={{
          backgroundColor: neutral17,
          padding: layout.spacing_x2,
          borderWidth: 0,
          marginBottom: layout.spacing_x2,
        }}
      >
        <BrandText style={[{ color: neutralFF, alignSelf: "flex-start" }]}>
          Initial message
        </BrandText>

        <SpacerColumn size={3} />

        <TextInputCustom
          value={initialMessage}
          onChangeText={(text) => setInitialMessage(text)}
          label=""
          name="initialMessage"
          placeholder="Enter details here..."
          hideLabel
          multiline
          noBrokenCorners
          containerStyle={{ width: "100%" }}
          textInputStyle={{ height: 80 }}
        />

        <SpacerColumn size={3} />

        <PrimaryButtonOutline
          noBrokenCorners
          disabled={!initialMessage}
          size="SM"
          color={redDefault}
          text="Ask for conflict solver"
          style={{ alignSelf: "flex-end" }}
          onPress={async () => {
            const [network, userAddress] = parseUserId(userId);
            if (!network || !userAddress) {
              throw new Error("Invalid user id");
            }
            if (!projectId) {
              throw new Error("Invalid project id");
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
              func: "RequestConflictResolution",
              args: [projectId, "The other guy is not nice"],
            });
          }}
        />
      </TertiaryBox>
    </>
  );
};

type UserRole = "initiator" | "responder" | "resolver" | "observer";
type PartyRole = "contractor" | "funder";

const OngoingConflictSection: FC<{
  userId: string | undefined;
  projectId: string | undefined;
}> = ({ userId, projectId }) => {
  const [network, userAddress] = parseUserId(userId);
  const [outcome, setOutcome] = useState<number>(1);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [resolutionMessage, setResolutionMessage] = useState<string>("");
  const { data: project } = useProject(network?.id, projectId);
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

  let initiatorRole: PartyRole;
  if (lastConflict?.initiator === project?.contractor) {
    initiatorRole = "contractor";
  } else {
    initiatorRole = "funder";
  }
  let responderRole: PartyRole;
  if (responderAddress === project?.contractor) {
    responderRole = "contractor";
  } else {
    responderRole = "funder";
  }

  return (
    <View>
      <BrandText style={[fontSemibold28, { marginBottom: layout.spacing_x2 }]}>
        Ongoing conflict
      </BrandText>
      <TertiaryBox
        style={{
          backgroundColor: neutral17,
          padding: layout.spacing_x2,
          borderWidth: 0,
          marginBottom: layout.spacing_x2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <BrandText>
            Initial message by {initiatorRole} on{" "}
            {moment((lastConflict?.createdAt || 0) * 1000).format(
              "MMM D, YYYY",
            )}
          </BrandText>
          <UsernameWithAvatar
            userId={getUserId(network?.id, lastConflict?.initiator)}
          />
        </View>
        <SpacerColumn size={2} />
        <TextInputCustom
          value={lastConflict?.initiatorMessage}
          disabled
          label=""
          name="initialMessage"
          placeholder="Enter details here..."
          hideLabel
          multiline
          noBrokenCorners
          containerStyle={{ width: "100%" }}
          textInputStyle={{ height: 80 }}
        />

        {(userRole === "responder" || !!lastConflict?.respondedAt) && (
          <>
            <SpacerColumn size={3} />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <BrandText>
                Response by {responderRole} on{" "}
                {moment(
                  (lastConflict?.respondedAt || 0) * 1000 || Date.now(),
                ).format("MMM D, YYYY")}
              </BrandText>
              <UsernameWithAvatar
                userId={getUserId(network?.id, responderAddress)}
              />
            </View>
            <SpacerColumn size={2} />
            <TextInputCustom
              value={
                lastConflict?.responseMessage || responseMessage || undefined
              }
              disabled={
                userRole !== "responder" || !!lastConflict?.responseMessage
              }
              onChangeText={setResponseMessage}
              label=""
              name="responseMessage"
              placeholder={
                userRole === "responder"
                  ? "Enter response here..."
                  : "No response"
              }
              hideLabel
              multiline
              noBrokenCorners
              containerStyle={{ width: "100%" }}
              textInputStyle={{ height: 80 }}
            />
            {userRole === "responder" && !lastConflict?.respondedAt && (
              <>
                <SpacerColumn size={3} />
                <PrimaryButtonOutline
                  noBrokenCorners
                  disabled={!responseMessage}
                  size="SM"
                  color={redDefault}
                  text="Respond"
                  style={{ alignSelf: "flex-end" }}
                  onPress={async () => {
                    if (!projectId) {
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
                      args: [projectId, responseMessage],
                    });
                  }}
                />
              </>
            )}
          </>
        )}

        {(!!lastConflict?.resolvedAt || userRole === "resolver") &&
          !lastConflict?.respondedAt && (
            <>
              <SpacerColumn size={3} />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <BrandText style={{ color: errorColor }}>
                  No response from {responderRole} after{" "}
                  {moment((lastConflict?.createdAt || 0) * 1000).fromNow(true)}
                </BrandText>
                <UsernameWithAvatar
                  userId={getUserId(network?.id, responderAddress)}
                />
              </View>
            </>
          )}

        {userRole !== "resolver" && !lastConflict?.resolvedAt && (
          <>
            <SpacerColumn size={3} />
            <BrandText style={{ color: yellowDefault }}>
              Waiting for{!lastConflict?.respondedAt ? " response or " : " "}
              resolution for{" "}
              {moment((lastConflict?.createdAt || 0) * 1000).fromNow(true)}...
            </BrandText>
          </>
        )}

        {(userRole === "resolver" || !!lastConflict?.resolvedAt) && (
          <>
            <SpacerColumn size={3} />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <BrandText>Verdict</BrandText>
              <UsernameWithAvatar
                userId={getUserId(network?.id, project?.conflictHandler)}
              />
            </View>
            <SpacerColumn size={2} />
            <TextInputCustom
              value={
                lastConflict?.resolutionMessage ||
                resolutionMessage ||
                undefined
              }
              disabled={!!lastConflict?.resolvedAt}
              onChangeText={setResolutionMessage}
              label=""
              name="resolutionMessage"
              placeholder="Enter rationale here..."
              hideLabel
              multiline
              noBrokenCorners
              containerStyle={{ width: "100%" }}
              textInputStyle={{ height: 80 }}
            />
            {userRole === "resolver" && !lastConflict?.resolvedAt && (
              <>
                <SpacerColumn size={2} />
                <OutcomeSelect value={outcome} onChange={setOutcome} />
                <SpacerColumn size={2} />
                <PrimaryButtonOutline
                  noBrokenCorners
                  disabled={!resolutionMessage}
                  size="SM"
                  color={redDefault}
                  text="Resolve conflict"
                  style={{ alignSelf: "flex-end" }}
                  onPress={async () => {
                    if (!projectId) {
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
                      args: [projectId, outcome.toString(), resolutionMessage],
                    });
                  }}
                />
              </>
            )}
          </>
        )}
      </TertiaryBox>
    </View>
  );
};

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

const SettledConflictsSection: FC<{
  networkId: string | undefined;
  projectId: string | undefined;
}> = ({ networkId, projectId }) => {
  const { data: project } = useProject(networkId, projectId);
  return (
    <>
      <BrandText style={[fontSemibold28]}>Settled conflicts</BrandText>
      {[...(project?.conflicts || [])]
        .reverse()
        .filter((c) => !!c.outcome)
        .map((conflict, index) => {
          let responderAddress;
          if (conflict.initiator === project?.contractor) {
            responderAddress = project?.funder;
          } else {
            responderAddress = project?.contractor;
          }

          let initiatorRole: PartyRole;
          if (conflict.initiator === project?.contractor) {
            initiatorRole = "contractor";
          } else {
            initiatorRole = "funder";
          }
          let responderRole: PartyRole;
          if (responderAddress === project?.contractor) {
            responderRole = "contractor";
          } else {
            responderRole = "funder";
          }

          let outcomeColor, outcomeText;
          switch (conflict.outcome) {
            case ConflictOutcome.RESUME_CONTRACT:
              outcomeColor = "white";
              outcomeText = "Project resumed";
              break;
            case ConflictOutcome.REFUND_FUNDER:
              outcomeColor = errorColor;
              outcomeText = "Funder reimbursed";
              break;
            case ConflictOutcome.PAY_CONTRACTOR:
              outcomeColor = errorColor;
              outcomeText = "Contractor paid";
              break;
            default:
              outcomeColor = errorColor;
              outcomeText = "Unknown outcome";
              break;
          }

          return (
            <>
              <SpacerColumn size={3} />
              <TertiaryBox
                style={{
                  backgroundColor: neutral17,
                  padding: layout.spacing_x2,
                  borderWidth: 0,
                  marginBottom: layout.spacing_x2,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <BrandText>
                    Initial message by {initiatorRole} on{" "}
                    {moment(
                      (conflict.createdAt || 0) * 1000 || Date.now(),
                    ).format("MMM D, YYYY")}
                  </BrandText>
                  <UsernameWithAvatar
                    userId={getUserId(networkId, conflict?.initiator)}
                  />
                </View>
                <SpacerColumn size={2} />
                <TextInputCustom
                  value={conflict?.initiatorMessage}
                  disabled
                  label=""
                  name="initialMessage"
                  placeholder="Enter details here..."
                  hideLabel
                  multiline
                  noBrokenCorners
                  containerStyle={{ width: "100%" }}
                  textInputStyle={{ height: 80 }}
                />

                <SpacerColumn size={3} />

                {conflict.respondedAt ? (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <BrandText>
                        Response by {responderRole} on{" "}
                        {moment(
                          (conflict.respondedAt || 0) * 1000 || Date.now(),
                        ).format("MMM D, YYYY")}
                      </BrandText>
                      <UsernameWithAvatar
                        userId={getUserId(networkId, responderAddress)}
                      />
                    </View>
                    <SpacerColumn size={2} />
                    <TextInputCustom
                      value={conflict.responseMessage || undefined}
                      disabled
                      label=""
                      name="responseMessage"
                      hideLabel
                      multiline
                      noBrokenCorners
                      containerStyle={{ width: "100%" }}
                      textInputStyle={{ height: 80 }}
                    />
                  </>
                ) : (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <BrandText style={{ color: errorColor }}>
                        No response from {responderRole} after{" "}
                        {moment((conflict.createdAt || 0) * 1000).fromNow(true)}
                      </BrandText>
                      <UsernameWithAvatar
                        userId={getUserId(networkId, responderAddress)}
                      />
                    </View>
                  </>
                )}

                <SpacerColumn size={3} />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <BrandText>
                    Verdict on{" "}
                    {moment(
                      (conflict.resolvedAt || 0) * 1000 || Date.now(),
                    ).format("MMM D, YYYY")}
                  </BrandText>
                  <UsernameWithAvatar
                    userId={getUserId(networkId, project?.conflictHandler)}
                  />
                </View>
                <SpacerColumn size={2} />
                <TextInputCustom
                  value={conflict.resolutionMessage || undefined}
                  disabled
                  label=""
                  name="resolutionMessage"
                  hideLabel
                  multiline
                  noBrokenCorners
                  containerStyle={{ width: "100%" }}
                  textInputStyle={{ height: 80 }}
                />
                <SpacerColumn size={2} />
                <BrandText
                  style={{
                    color: outcomeColor,
                  }}
                >
                  {outcomeText}
                </BrandText>
              </TertiaryBox>
            </>
          );
        })}
    </>
  );
};
