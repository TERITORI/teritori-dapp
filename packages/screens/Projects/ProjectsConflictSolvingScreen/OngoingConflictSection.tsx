import { Picker } from "@react-native-picker/picker";
import moment from "moment/moment";
import React, { FC, useState } from "react";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { PrimaryButtonOutline } from "@/components/buttons/PrimaryButtonOutline";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import { SpacerColumn } from "@/components/spacer";
import { UsernameWithAvatar } from "@/components/user/UsernameWithAvatar";
import { getUserId, parseUserId } from "@/networks";
import {
  PartyRole,
  UserRole,
} from "@/screens/Projects/ProjectsConflictSolvingScreen/types";
import { useEscrowContract } from "@/screens/Projects/hooks/useEscrowContract";
import { useProject } from "@/screens/Projects/hooks/useProjects";
import {
  errorColor,
  neutral17,
  redDefault,
  yellowDefault,
} from "@/utils/style/colors";
import { fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const OngoingConflictSection: FC<{
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

  const { execEscrowMethod } = useEscrowContract(network?.id, userAddress);

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

                    await execEscrowMethod("RespondToConflict", [
                      projectId,
                      responseMessage,
                    ]);
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

                    await execEscrowMethod("ResolveConflict", [
                      projectId,
                      outcome.toString(),
                      resolutionMessage,
                    ]);
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
